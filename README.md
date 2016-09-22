# FrontPage MEAN powered

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.

The project has a node.js server as backend, 
this server connects to a Mongo DataBase and provide a RESTful interface to CRUD Data.

- `server.js` is the main file of the project, you can run it with `node server.js`
- Do not forget to generate the node modules, use `node install`
- Do not forget to generate the bower components, use `bower install` and then put them in the app folder
- Do not forget to set properly `serverPath` in `common.services.js` in order to point correctly to the services

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.
