import { Injectable } from '@angular/core';
import {
  BaseNodeBE,
  CatalogBE,
  NodeContentsBE,
  NodeInCultureWithChildrenBE,
  NodeInCultureWithContentBE,
  NodeSearchResultsBE,
} from 'src/app/api';
import {
  BaseCategory,
  Catalog,
  Category,
  Content,
  ContentType,
  kvContentTypes,
  kvContentTypesList,
  Product,
} from './catalog.reducer';
import { SearchAutocompleteResult } from './catalog.resource';

@Injectable({ providedIn: 'root' })
export class CatalogParser {
  parseCatalog(catalogs: { [key: string]: CatalogBE }): Array<Catalog> {
    return Object.entries(catalogs).map(([k, catalog]) => ({
      code: k,
      name: catalog.name,
      id: catalog.id,
    }));
  }

  parseCategories(cats: NodeInCultureWithChildrenBE): Array<Category | Product> {
    return cats.children
      .map((c) => {
        return {
          oid: c.oid,
          label: c.name,
          level: c.level,
          cultureCode: c.cultureCode,
          status: new Set(c.status),
          isLoading: false,
          prodnum: c.productNumber,
          productline: c.productLine,
          isProduct: !!c.productNumber,
        };
      })
      .sort((cat1, cat2) => (cat1.label > cat2.label ? 1 : -1));
  }

  parseContent(content: NodeInCultureWithContentBE, contentType: ContentType): Content {
    return {
      oid: content.oid,
      productName: content.name,
      productNumber: content.productNumber,
      others: this.parseTableContent(content.contents, contentType),
      parents: content.path?.map((node) => this.parseNode(node)) ?? [],
    };
  }

  parseSearchAutocomplete(result: NodeSearchResultsBE): SearchAutocompleteResult {
    const list =
      result.results?.map((r) => {
        return {
          oid: r.oid,
          name: r.name,
          highlightedName: r.highlightedName,
        };
      }) ?? [];
    return {
      result: list,
    };
  }

  private parseNode(node: BaseNodeBE): BaseCategory {
    return {
      label: node.name,
      oid: node.oid,
      level: node.level,
    };
  }

  private parseTableContent(content: NodeContentsBE, contentType: ContentType) {
    if (this.isKvContent(contentType)) {
      const nodeContent = content[contentType];
      if (nodeContent) {
        return Object.entries(nodeContent).map(([key, value]) => ({ key, value }));
      }
    }

    throw new Error(`Unsupported contentType: ${contentType}`);
  }

  private isKvContent(contentType: ContentType): contentType is kvContentTypes {
    return kvContentTypesList.includes(contentType as kvContentTypes);
  }
}
