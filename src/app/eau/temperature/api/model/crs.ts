/**
 * API Hub\'Eau - Température des cours d\'eau en continu
 * Adresse de la documentation http://hubeau.eaufrance.fr/page/api-temperature-en-continu-cours-deau
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface CrsBE { 
    properties?: object;
    type?: CrsBE.TypeEnum;
}
export namespace CrsBE {
    export type TypeEnum = 'name' | 'link';
    export const TypeEnum = {
        Name: 'name' as TypeEnum,
        Link: 'link' as TypeEnum
    };
}


