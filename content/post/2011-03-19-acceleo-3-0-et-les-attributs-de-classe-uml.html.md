---
section: post
date: "2011-03-19"
title: "Acceleo 3.0 et les attributs de classe UML."
slug: acceleo-3-0-et-les-attributs-de-classe-uml
tags:
 - acceleo
 - eclipse
 - g33k
 - java
 - uml

lastmod: 2017-03-01T11:27:27+01:00
---

Ah lala ça fait depuis quelque temps que j'utilise [Acceleo](http://www.eclipse.org/acceleo/) pour faire pas de mal de chose (Génération de code Java, Docbook, etc.), et bon j'ai été confronté à un problème particulier. Il faut savoir que dans le métamodele UML, la liste des attributs (Property) est marqué comme _unordered_, ce qui a pour effet dans [Acceleo](http://www.eclipse.org/acceleo/) suite à des générations successives de mélanger les attributs de votre classe.

Vous me direz pas très grave pour un bean Java, mais ça devient plus compliqué quand celui-ci est un bean à persistance (type JPA). En effet, les ORM utilisent souvent la position de l'attribut dans la classe pour générer la colonne associée. Et surtout vu qu'il s'agit d'un visiteur l'ordre des colonnes est égal à l'ordre de l'apparition des attributs dans cette classe mappée.

J'ai donc utilisé une query template avec un service externe Java pour ordonner ma liste d'attributs en fonction d'une taggedvalue d'un stéréotype appliqué à la classe.

``` java
/**
 * Return an ordered list of property according to OrderedAttributes stereotype.
 * @param c
 * @return
 */
 public Collection<Property> getOrderedProperties(org.eclipse.uml2.uml.Class c) {
    	Stereotype orderedAttributeStereotype = c.getAppliedStereotype("extensions::OrderedAttributes");
    	if(orderedAttributeStereotype != null) {
    		String attributeList = (String) c.getValue(orderedAttributeStereotype, "list");
    		if(attributeList != null && !attributeList.isEmpty()) {
    			String attributes[] = attributeList.split(",");

    			LinkedHashMap<String, Property> orderedAttributes = new LinkedHashMap<String, Property>();
    			for(String att : attributes) {
    				att = att.trim();

    				for(Property p : c.getAllAttributes()) {
    					if(p.getName().equalsIgnoreCase(att)) {
    						orderedAttributes.put(att, p);
    					}
    				}
    			}

    			return orderedAttributes.values();
    		}
    	}
    	return c.getAllAttributes();
    }
```

Voici le code du service Java pour [Acceleo](http://www.eclipse.org/acceleo/), ainsi que la query dans le template :

``` java
[ query public getOrderedProperties(c : Class) : Sequence(Property) = invoke('org.zenithar.common.acceleo.uml.UML2Services', 'getOrderedProperties(org.eclipse.uml2.uml.Class)', Sequence{c}) /]
```

Voila maintenant comment utilise-t-on ce code ?

J'utilise [TextUML](http://abstratt.com/) pour éditer mes modèles UML (pour des raisons de mise en conf Git plus simple, enfin ce n'est pas le sujet.), voici un exemple avec [TextUML](http://abstratt.com/) :

```
[extensions::Entity(prefix="PER", tableName="PERSON"), extensions::OrderedAttributes(list="id,firstName,lastName")]
class Person
(* Primary Key *)
[extensions::Column(colName="ID"),extensions::PrimaryKey]
attribute id : Integer;

(* Person 's firstname *)
[extensions::Column(colName="FNAME", nullable="false", length="50")]
attribute firstName : String;

(* Person 's lastname *)
[extensions::Column(colName="LNAME", nullable="false", length="50")]
attribute lastName : String;

end;
```

Et dans le template [Acceleo](http://www.eclipse.org/acceleo/) :

``` java
[for (p : Property | c.getOrderedProperties())]
....
[/for]
```

Où c qualifie la classe en cours de visite.

Voila j'espère que cela vous aidera. Solution certifiée [ISO-1664](http://www.risacher.com/la-rache/index.php?z=3) !!!

Biensur je suis toujours preneur d'autres solutions mais celle-ci fonctionne. Peut être uniquement dans mon cas précis, mais c'est le principal.
