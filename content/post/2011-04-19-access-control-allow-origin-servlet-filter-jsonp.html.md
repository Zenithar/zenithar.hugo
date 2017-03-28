---
section: post
date: "2011-04-19"
title: "Access control Allow Origin Servlet Filter & JSONP"
slug: access-control-allow-origin-servlet-filter-jsonp
tags:
 - http
 - jsonp
 - servlet
 - webservices

lastmod: 2017-03-01T11:27:27+01:00
---

Voici comment ajouter l'entête HTTP Access-control-allow-origin, bien connu des utilisateurs de JSON, AMF ou tout simplement de service REST.

``` java
package org.zenithar.servlet.filters;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Add JSONP Support to enunciate.
 *
 * @author Thibault NORMAND
 *
 */
public class JsonpFilter implements Filter {

    private String functionName;

    @Override
    public void destroy() {

    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse servletResponse,
                         FilterChain chain) throws IOException, ServletException {

        if (!(request instanceof HttpServletRequest)) {
            throw new ServletException("This filter can "
                                       + " only process HttpServletRequest requests");
        }

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        if (isJSONPRequest(httpRequest)) {
            ServletOutputStream out = response.getOutputStream();

            out.println(getCallbackMethod(httpRequest) + "(");
            chain.doFilter(request, response);
            out.println(");");

            response.setContentType("text/javascript");
        } else {
            response.addHeader("Access-Control-Allow-Origin", "*");
            chain.doFilter(request, response);
        }

    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        this.functionName = filterConfig.getInitParameter("encoding");
        if(this.functionName == null || this.functionName.length() <= 0) {
            this.functionName = "callback";
        }
    }

    private String getCallbackMethod(HttpServletRequest httpRequest) {
        return httpRequest.getParameter(this.functionName);
    }

    private boolean isJSONPRequest(HttpServletRequest httpRequest) {
        String callbackMethod = getCallbackMethod(httpRequest);
        return (callbackMethod != null && callbackMethod.length() > 0);
    }

}
```

Exemple de configuration de votre fichier web.xml

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app id="dataservices" xmlns="http://java.sun.com/xml/ns/javaee"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd"
	version="2.5">

	<display-name>DataServices</display-name>

	<filter>
		<filter-name>JSONPRequestFilter</filter-name>
		<filter-class>org.zenithar.servlet.filters.JsonpFilter</filter-class>
		<init-param>
			<param-name>functionName</param-name>
			<param-value>callback</param-value>
		</init-param>
	</filter>

	<filter-mapping>
		<filter-name>JSONPRequestFilter</filter-name>
		<url-pattern>/json/*</url-pattern>
	</filter-mapping>
</web-app>
```

Et voila, bon code !
[[ENUNCIATE-482]](http://jira.codehaus.org/browse/ENUNCIATE-482)

