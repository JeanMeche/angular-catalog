# PocCatalog

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## OpenApi Generator
`npm run openapi-gen` to generate the API from the `swagger.json`. 

NB: This project is using local mustache templates because the default templates generate erronous code (Duplicate Identifier TS2300). <br>
[See this issue on GitHub](https://github.com/OpenAPITools/openapi-generator/issues/5853)