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

import {
  HttpClient,
  HttpContext,
  HttpEvent,
  HttpHeaders,
  HttpParameterCodec,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { Configuration } from '../configuration';
import { CustomHttpParameterCodec } from '../encoder';
// @ts-ignore
import { CommuneBE } from '../model/commune';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS } from '../variables';

export interface CommunesCodeGetRequestParams {
  /** Code INSEE de la commune */
  code: string;
  /** Liste des champs souhaités dans la réponse */
  fields?: Array<
    | 'nom'
    | 'code'
    | 'codesPostaux'
    | 'centre'
    | 'surface'
    | 'contour'
    | 'codeDepartement'
    | 'departement'
    | 'codeRegion'
    | 'region'
    | 'population'
  >;
  /** Format de réponse attendu */
  format?: 'json' | 'geojson';
  /** Géométrie à utiliser pour la sortie géographique */
  geometry?: 'centre' | 'contour';
}

export interface CommunesGetRequestParams {
  /** Code postal associé */
  codePostal?: string;
  /** Latitude (en degrés) */
  lat?: number;
  /** Longitude (en degrés) */
  lon?: number;
  /** Nom de la commune */
  nom?: string;
  /** Mode de boost de la recherche par nom */
  boost?: string;
  /** Code de la commune */
  code?: string;
  /** Code du département associé */
  codeDepartement?: string;
  /** Code de la région associée */
  codeRegion?: string;
  /** Liste des champs souhaités dans la réponse */
  fields?: Array<
    | 'nom'
    | 'code'
    | 'codesPostaux'
    | 'centre'
    | 'surface'
    | 'contour'
    | 'codeDepartement'
    | 'departement'
    | 'codeRegion'
    | 'region'
    | 'population'
  >;
  /** Format de réponse attendu */
  format?: 'json' | 'geojson';
  /** Géométrie à utiliser pour la sortie géographique */
  geometry?: 'centre' | 'contour';
}

export interface DepartementsCodeCommunesGetRequestParams {
  /** Code du département */
  code: string;
  /** Liste des champs souhaités dans la réponse */
  fields?: Array<
    | 'nom'
    | 'code'
    | 'codesPostaux'
    | 'centre'
    | 'surface'
    | 'contour'
    | 'codeDepartement'
    | 'departement'
    | 'codeRegion'
    | 'region'
    | 'population'
  >;
  /** Format de réponse attendu */
  format?: 'json' | 'geojson';
  /** Géométrie à utiliser pour la sortie géographique */
  geometry?: 'centre' | 'contour';
}

@Injectable({
  providedIn: 'root',
})
export class CommunesService {
  protected basePath = 'https://geo.api.gouv.fr';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();
  public encoder: HttpParameterCodec;

  constructor(
    protected httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() configuration: Configuration
  ) {
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
    if (typeof value === 'object' && value instanceof Date === false) {
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

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        (value as any[]).forEach((elem) => (httpParams = this.addToHttpParamsRecursive(httpParams, elem, key)));
      } else if (value instanceof Date) {
        if (key != null) {
          httpParams = httpParams.append(key, (value as Date).toISOString().substr(0, 10));
        } else {
          throw Error('key may not be null if value is Date');
        }
      } else {
        Object.keys(value).forEach(
          (k) => (httpParams = this.addToHttpParamsRecursive(httpParams, value[k], key != null ? `${key}.${k}` : k))
        );
      }
    } else if (key != null) {
      httpParams = httpParams.append(key, value);
    } else {
      throw Error('key may not be null if value is not object or array');
    }
    return httpParams;
  }

  /**
   * Récupérer les informations concernant une commune
   * @param requestParameters
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public communesCodeGet(
    requestParameters: CommunesCodeGetRequestParams,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<CommuneBE>;
  public communesCodeGet(
    requestParameters: CommunesCodeGetRequestParams,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<HttpResponse<CommuneBE>>;
  public communesCodeGet(
    requestParameters: CommunesCodeGetRequestParams,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<HttpEvent<CommuneBE>>;
  public communesCodeGet(
    requestParameters: CommunesCodeGetRequestParams,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<any> {
    const code = requestParameters.code;
    if (code === null || code === undefined) {
      throw new Error('Required parameter code was null or undefined when calling communesCodeGet.');
    }
    const fields = requestParameters.fields;
    const format = requestParameters.format;
    const geometry = requestParameters.geometry;

    let localVarQueryParameters = new HttpParams({ encoder: this.encoder });
    if (fields) {
      localVarQueryParameters = this.addToHttpParams(
        localVarQueryParameters,
        fields.join(COLLECTION_FORMATS['csv']),
        'fields'
      );
    }
    if (format !== undefined && format !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>format, 'format');
    }
    if (geometry !== undefined && geometry !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>geometry, 'geometry');
    }

    let localVarHeaders = this.defaultHeaders;

    let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json'];
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

    return this.httpClient.get<CommuneBE>(
      `${this.configuration.basePath}/communes/${encodeURIComponent(String(code))}`,
      {
        context: localVarHttpContext,
        params: localVarQueryParameters,
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: localVarHeaders,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Recherche des communes
   * @param requestParameters
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public communesGet(
    requestParameters: CommunesGetRequestParams,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<Array<CommuneBE>>;
  public communesGet(
    requestParameters: CommunesGetRequestParams,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<HttpResponse<Array<CommuneBE>>>;
  public communesGet(
    requestParameters: CommunesGetRequestParams,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<HttpEvent<Array<CommuneBE>>>;
  public communesGet(
    requestParameters: CommunesGetRequestParams,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<any> {
    const codePostal = requestParameters.codePostal;
    const lat = requestParameters.lat;
    const lon = requestParameters.lon;
    const nom = requestParameters.nom;
    const boost = requestParameters.boost;
    const code = requestParameters.code;
    const codeDepartement = requestParameters.codeDepartement;
    const codeRegion = requestParameters.codeRegion;
    const fields = requestParameters.fields;
    const format = requestParameters.format;
    const geometry = requestParameters.geometry;

    let localVarQueryParameters = new HttpParams({ encoder: this.encoder });
    if (codePostal !== undefined && codePostal !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>codePostal, 'codePostal');
    }
    if (lat !== undefined && lat !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>lat, 'lat');
    }
    if (lon !== undefined && lon !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>lon, 'lon');
    }
    if (nom !== undefined && nom !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>nom, 'nom');
    }
    if (boost !== undefined && boost !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>boost, 'boost');
    }
    if (code !== undefined && code !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>code, 'code');
    }
    if (codeDepartement !== undefined && codeDepartement !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>codeDepartement, 'codeDepartement');
    }
    if (codeRegion !== undefined && codeRegion !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>codeRegion, 'codeRegion');
    }
    if (fields) {
      localVarQueryParameters = this.addToHttpParams(
        localVarQueryParameters,
        fields.join(COLLECTION_FORMATS['csv']),
        'fields'
      );
    }
    if (format !== undefined && format !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>format, 'format');
    }
    if (geometry !== undefined && geometry !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>geometry, 'geometry');
    }

    let localVarHeaders = this.defaultHeaders;

    let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json'];
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

    return this.httpClient.get<Array<CommuneBE>>(`${this.configuration.basePath}/communes`, {
      context: localVarHttpContext,
      params: localVarQueryParameters,
      responseType: <any>responseType_,
      withCredentials: this.configuration.withCredentials,
      headers: localVarHeaders,
      observe: observe,
      reportProgress: reportProgress,
    });
  }

  /**
   * Renvoi les communes d\&#39;un département
   * @param requestParameters
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public departementsCodeCommunesGet(
    requestParameters: DepartementsCodeCommunesGetRequestParams,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<CommuneBE>;
  public departementsCodeCommunesGet(
    requestParameters: DepartementsCodeCommunesGetRequestParams,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<HttpResponse<CommuneBE>>;
  public departementsCodeCommunesGet(
    requestParameters: DepartementsCodeCommunesGetRequestParams,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<HttpEvent<CommuneBE>>;
  public departementsCodeCommunesGet(
    requestParameters: DepartementsCodeCommunesGetRequestParams,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext }
  ): Observable<any> {
    const code = requestParameters.code;
    if (code === null || code === undefined) {
      throw new Error('Required parameter code was null or undefined when calling departementsCodeCommunesGet.');
    }
    const fields = requestParameters.fields;
    const format = requestParameters.format;
    const geometry = requestParameters.geometry;

    let localVarQueryParameters = new HttpParams({ encoder: this.encoder });
    if (fields) {
      localVarQueryParameters = this.addToHttpParams(
        localVarQueryParameters,
        fields.join(COLLECTION_FORMATS['csv']),
        'fields'
      );
    }
    if (format !== undefined && format !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>format, 'format');
    }
    if (geometry !== undefined && geometry !== null) {
      localVarQueryParameters = this.addToHttpParams(localVarQueryParameters, <any>geometry, 'geometry');
    }

    let localVarHeaders = this.defaultHeaders;

    let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json'];
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

    return this.httpClient.get<CommuneBE>(
      `${this.configuration.basePath}/departements/${encodeURIComponent(String(code))}/communes`,
      {
        context: localVarHttpContext,
        params: localVarQueryParameters,
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: localVarHeaders,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }
}
