---
section: post
date: "2016-01-15"
title: "Utiliser Tyk comme proxy VirusTotal"
description: "Centraliser/Monitorer les accès aux services VT à l'aide du proxy golang Tyk."
slug: tyk-proxy-virustotal
featured: true
tags:
 - securite
 - virustotal
 - golang
lastmod: 2017-03-01T11:27:29+01:00
---

# Tyk, serveur proxy API

[Tyk.io](https://tyk.io/) est un reverse-proxy permettant de contrôller /
monitorer les accès aux API.

Le serveur, écrit en `golang`, est OpenSource et gratuit, mais la documentation
n'est pas très simple d'accès. Il existe un `dashboard payant` exploitant les
données de traffic du reverse-proxy.

Avec Tyk, vous pouvez simplement ajouter :

  * Des quotas et des limites d'accès en volume ;
  * Des mécanismes d'authentification (Basic, JWT, HMAC, OAUTH 2.0) ;
  * Des informations sur le comportement de vos APIs (accès, erreurs, etc.) ;
  * Des informations sur la supervision et les performances ;
  * Des mécanismes de notifications (email, webhook)
  * Des chaînes de transformations de requêtes et corps associés ;
  * Des politiques de sécurité concernant l'accès aux API / sous-API ;
  * La suite sur le [site](https://tyk.io/) ...

Pour faire simple, si vous ne voulez pas embarquer toutes les logiques métiers
liées à la sécurité, le monitoring, la supervision, je vous conseille de jeter
un oeil sur Tyk.

# VirusTotal

[VirusTotal](http://www.virustotal.com) est un service d'analyse en cloud pour
les analyses de virus, ce n'est pas une sandbox comme [Cuckoo](https://cuckoosandbox.org/).

Il s'agit d'un système qui va faire analyser votre fichier / url par un [bataillon
d'antivirus, antimalware, d'analyseur de fichier (ssdeep, hash)](https://www.virustotal.com/en/about/credits/).

Ces analyses vont générer un certains nombre d'informations (signatures, hashes, etc).

Le service est gratuit, mais lorsque l'on souhaite obtenir des accès API
pour industrialisation il faut payer.
L'identification se fait à l'aide d'une `API KEY`, sous la forme d'un héxadécimal.
Cette clé peut être récupérée sur votre profil VirusTotal.

Cette clé est associée à votre compte utilisateur et à la souscription que vous
avez.

> Souscription donnant lieu principalement à une limitation en volume de requêtes.

Lorsque l'on monte un service en entreprise autour de VirusTotal, vous ne pouvez
pas donner un compte à tous les utilisateurs API.

Afin de faire des économies de requêtes, ainsi qu'un contrôle d'accès interne,
je vous propose de mettre en place Tyk comme proxy aux WebServices VirusTotal.

# Configuration

Nous allons mettre en place un proxy fournissant tous les services VT en local.
Les requêtes vers VT seront mises en cache pour plus de réactivité.

Le principe est :

  * Transférer tous les appels locaux à VT ;
  * Ajouter le paramètre `apikey` à chaque requète de manière transparente, évitant
    ainsi aux utilisateurs de connaître la clé d'API ;

Il faut commencer par déclarer une API sous Tyk.

```js
{
    "name": "VirusTotal API",
    "use_keyless": true,
    "version_data": {
        "not_versioned": true,
        "versions": {
            "Default": {
                "name": "Default",
                "expires": "3000-01-02 15:04",
                "use_extended_paths": true,
                "extended_paths": {
                    "cache": ["v2"],
                    "ignored": [],
                    "white_list": [],
                    "black_list": []
                }
            }
        }
    },
    "proxy": {
        "listen_path": "/vtapi/",
        "target_url": "https://www.virustotal.com/vtapi/",
        "strip_listen_path": true
    },
    "cache_options": {
      "cache_timeout": 10,
      "enable_cache": true,
      "cache_all_safe_requests": true,
      "enable_upstream_cache_control": false
    },
    "custom_middleware": {
      "pre": [
        {
          "name": "vtPreProcessMiddleware",
          "path": "middleware/vtkey.js",
          "require_session": false
        }
      ]
    },
    "enable_batch_request_support": false
}
```

La modification des requêtes via Tyk, se fait à l'aide de `middlewares` codés en
Javascript.

```js
// ---- Sample middleware creation by end-user -----
var vtPreProcessMiddleware = new TykJS.TykMiddleware.NewMiddleware({});

vtPreProcessMiddleware.NewProcessRequest(function(request, session) {
    // Add or delete request parmeters, these are encoded for the request as needed.
    request.AddParams["apikey"] = "votreapikey";
    // You MUST return both the request and session metadata
    return vtPreProcessMiddleware.ReturnData(request, {});
});

// Ensure init with a post-declaration log message
log("VirusTotal middleware initialised");
```

N'oubliez pas d'activer le support de Javascript dans Tyk, dans le fichier tyk.conf :
```yaml
...
"enable_jsvm": true
...
```

Et voilà, il suffit de lancer Tyk, puis de profiter du service VT sans utiliser
la clé d'API.

```sh
[zenithar:~]$ ./tyk --conf=./tyk.conf
INFO[0000] Hostname set:                                
INFO[0000] Connection dropped, connecting..             
INFO[0000] Setting up Server                            
INFO[0000] --> Standard listener (http)                 
INFO[0000] Loading API Specification from apps/vt.json  
INFO[0000] Detected 1 APIs                              
INFO[0000] --> Loading API: VirusTotal API              
INFO[0000] ----> Tracking: (no host)                    
INFO[0000] Loading JS File: middleware/vtkey.js         
INFO[0000] [JSVM] [LOG]: VirusTotal middleware initialised
INFO[0000] ----> Checking security policy: Open         
INFO[0000] Loading uptime tests...                      
INFO[0000] Gateway started (v1.9.1.1)                   
INFO[0000] --> Listening on port: 8080                  
INFO[0010] [HOST CHECK MANAGER] Starting Poller  
```

Le service Tyk est fonctionnel, il suffit de requêter le proxy pour consulter
VirusTotal.

```sh
[zenithar:~]$ curl -v http://localhost:8080/vtapi/v2/domain/report?domain=blog.zenithar.org
*   Trying ::1...
* Connected to localhost (::1) port 8080 (#0)
> GET /vtapi/v2/domain/report?domain=blog.zenithar.org HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.46.0
> Accept: */*
>
< HTTP/1.1 200 OK
< Cache-Control: no-cache
< Content-Type: application/json
< Server: Google Frontend
< Vary: Accept-Encoding
< X-Tyk-Cached-Response: 1
< Content-Length: 452
<
* Connection #0 to host localhost left intact
{"BitDefender category": "business", "domain_siblings": ["www.zenithar.org"], "whois": null, "response_code": 1, "verbose_msg": "Domain found in dataset", "Websense ThreatSeeker category": "uncategorized", "Webutation domain info": {"Verdict": "unsure", "Adult content": "no", "Safety score": 70}, "resolutions": [{"last_resolved": "2014-11-13 00:00:00", "ip_address": "176.31.112.5"}], "detected_urls": [], "categories": ["business", "uncategorized"]}
```

Notez l'entête `X-Tyk-Cached-Response`, il indique que Tyk a répondu avec une
réponse mise en cache.

> Attention à la mise en cache trop importante, vous risquez d'avoir des
problèmes trditionnels aux caches (évictions tardives, données plus valides en
cache, etc.).

Pour aller plus loin, et comme d'habitude, il faudrait mieux mettre tout cela
dans un conteneur Docker ...
