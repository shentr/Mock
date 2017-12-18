class Router {
    constructor() {
        if (!Router.instance) {
            this.routes = {};
            Router.instance = this;
        }
        return Router.instance;
    }
    setRoutes(routes) {
        this.routes = routes;
    }
    getRoutes() {
        return this.routes;
    }
    addRoutes(path, filePath) {
        this.routes[path] = filePath;
    }
    mixRoutes(routes) {
        this.routes = Object.assign(this.routes, routes);
    }
}

module.exports = Router;