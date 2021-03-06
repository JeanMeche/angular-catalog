/**
 * API Géo
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec, HttpContext 
        }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

// @ts-ignore
import { CommuneBE } from '../model/commune';
// @ts-ignore
import { DepartementBE } from '../model/departement';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


export interface DepartementsCodeCommunesGetRequestParams {
    /** Code du département */
    code: string;
    /** Liste des champs souhaités dans la réponse */
    fields?: Array<'nom' | 'code' | 'codesPostaux' | 'centre' | 'surface' | 'contour' | 'codeDepartement' | 'departement' | 'codeRegion' | 'region' | 'population'>;
    /** Format de réponse attendu */
    format?: 'json' | 'geojson';
    /** Géométrie à utiliser pour la sortie géographique */
    geometry?: 'centre' | 'contour';
}

export interface DepartementsCodeGetRequestParams {
    /** Code du département */
    code: string;
    /** Liste des champs souhaités dans la réponse */
    fields?: Array<'nom' | 'code' | 'codeRegion' | 'region'>;
}

export interface DepartementsGetRequestParams {
    /** Code du département */
    code?: string;
    /** Code région associé */
    codeRegion?: string;
    /** Nom du département */
    nom?: string;
    /** Liste des champs souhaités dans la réponse */
    fields?: Array<'nom' | 'code' | 'codeRegion' | 'region'>;
}

export interface RegionsCodeDepartementsGetRequestParams {
    /** Code de la région */
    code: string;
    /** Liste des champs souhaités dans la réponse */
    fields?: Array<'nom' | 'code'>;
}


@Injectable({
  providedIn: 'root'
})
export class DpartementsService {

    protected basePath = 'https://geo.api.gouv.fr';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    public encoder: HttpParameterCodec;

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }


    private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
        if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
        } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
        }
        return httpParams;
    }

    private addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
        if (value == null) {
            return httpParams;
        }

        if (typeof value === "object") {
            if (Array.isArray(value)) {
                (value as any[]).forEach( elem => httpParams = this.addToHttpParamsRecursive(httpParams, elem, key));
            } else if (value instanceof Date) {
                if (key != null) {
                    httpParams = httpParams.append(key,
                        (value as Date).toISOString().substr(0, 10));
                } else {
                   throw Error("key may not be null if value is Date");
                }
            } else {
                Object.keys(value).forEach( k => httpParams = this.addToHttpParamsRecursive(
                    httpParams, value[k], key != null ? `${key}.${k}` : k));
            }
        } else if (key != null) {
            httpParams = httpParams.append(key, value);
        } else {
            throw Error("key may not be null if value is not object or array");
        }
        return httpParams;
    }

    /**
     * Renvoi les communes d\&#39;un département
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public departementsCodeCommunesGet(requestParameters: DepartementsCodeCommunesGetRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<CommuneBE>;
    public departementsCodeCommunesGet(requestParameters: DepartementsCodeCommunesGetRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<CommuneBE>>;
    public departementsCodeCommunesGet(requestParameters: DepartementsCodeCommunesGetRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<CommuneBE>>;
    public departementsCodeCommunesGet(requestParameters: DepartementsCodeCommunesGetRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const code = requestParameters.code;
        if (code === null || code === undefined) {
            throw new Error('Required parameter code was null or undefined when calling departementsCodeCommunesGet.');
        }
        const fields = requestParameters.fields;
        const format = requestParameters.format;
        const geometry = requestParameters.geometry;

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (fields) {
            localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
                fields.join(COLLECTION_FORMATS['csv']), 'fields');
        }
        if (format !== undefined && format !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>format, 'format');
        }
        if (geometry !== undefined && geometry !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>geometry, 'geometry');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        return this.httpClient.get<CommuneBE>(`${this.configuration.basePath}/departements/${encodeURIComponent(String(code))}/communes`,
            {
                context: localVarHttpContext,
                params: localVarQueryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Récupérer les informations concernant un département
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public departementsCodeGet(requestParameters: DepartementsCodeGetRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<DepartementBE>;
    public departementsCodeGet(requestParameters: DepartementsCodeGetRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<DepartementBE>>;
    public departementsCodeGet(requestParameters: DepartementsCodeGetRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<DepartementBE>>;
    public departementsCodeGet(requestParameters: DepartementsCodeGetRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const code = requestParameters.code;
        if (code === null || code === undefined) {
            throw new Error('Required parameter code was null or undefined when calling departementsCodeGet.');
        }
        const fields = requestParameters.fields;

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (fields) {
            localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
                fields.join(COLLECTION_FORMATS['csv']), 'fields');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        return this.httpClient.get<DepartementBE>(`${this.configuration.basePath}/departements/${encodeURIComponent(String(code))}`,
            {
                context: localVarHttpContext,
                params: localVarQueryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Recherche des départements
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public departementsGet(requestParameters: DepartementsGetRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<Array<DepartementBE>>;
    public departementsGet(requestParameters: DepartementsGetRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<Array<DepartementBE>>>;
    public departementsGet(requestParameters: DepartementsGetRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<Array<DepartementBE>>>;
    public departementsGet(requestParameters: DepartementsGetRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const code = requestParameters.code;
        const codeRegion = requestParameters.codeRegion;
        const nom = requestParameters.nom;
        const fields = requestParameters.fields;

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (code !== undefined && code !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>code, 'code');
        }
        if (codeRegion !== undefined && codeRegion !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>codeRegion, 'codeRegion');
        }
        if (nom !== undefined && nom !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>nom, 'nom');
        }
        if (fields) {
            localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
                fields.join(COLLECTION_FORMATS['csv']), 'fields');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        return this.httpClient.get<Array<DepartementBE>>(`${this.configuration.basePath}/departements`,
            {
                context: localVarHttpContext,
                params: localVarQueryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Renvoi les départements d\&#39;une région
     * @param requestParameters
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public regionsCodeDepartementsGet(requestParameters: RegionsCodeDepartementsGetRequestParams, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<DepartementBE>;
    public regionsCodeDepartementsGet(requestParameters: RegionsCodeDepartementsGetRequestParams, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<DepartementBE>>;
    public regionsCodeDepartementsGet(requestParameters: RegionsCodeDepartementsGetRequestParams, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<DepartementBE>>;
    public regionsCodeDepartementsGet(requestParameters: RegionsCodeDepartementsGetRequestParams, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
        const code = requestParameters.code;
        if (code === null || code === undefined) {
            throw new Error('Required parameter code was null or undefined when calling regionsCodeDepartementsGet.');
        }
        const fields = requestParameters.fields;

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (fields) {
            localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
                fields.join(COLLECTION_FORMATS['csv']), 'fields');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        return this.httpClient.get<DepartementBE>(`${this.configuration.basePath}/regions/${encodeURIComponent(String(code))}/departements`,
            {
                context: localVarHttpContext,
                params: localVarQueryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
