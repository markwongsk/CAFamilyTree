module CAFamilyTree.DependencyGraph {

    export interface IDependencyGraphController {
        graph: Dagre.Graph;
    }

    export interface IDependencyGraphScope {
        dependencyGraphController: IDependencyGraphController;
    }

    export class DependencyGraphController implements IDependencyGraphController {
        public graph: Dagre.Graph;

        constructor($http: ng.IHttpService, $scope: IDependencyGraphScope) {
            $scope.dependencyGraphController = this;
            $http.get<string>("assets/CAFamilyData.csv").then((response) => {
                this.graph = constructGraph(response.data);
            });
        }

        private constructGraph(csvData: string) {
            var graph = new dagreD3.graphlib.Graph()
                .setGraph({})
                .setDefaultEdgeLabel(() => { return {}; });
        }
    }

    caFamilyTree.controller("dependencyGraphController", DependencyGraphController);
}
