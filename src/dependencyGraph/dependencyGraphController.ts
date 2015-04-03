module CAFamilyTree.DependencyGraph {

    export interface IDependencyGraphController {
        graph: Dagre.Graph;
    }

    export interface IDependencyGraphScope extends ng.IScope {
        dependencyGraphController: IDependencyGraphController;
    }

    export interface IRecitationInfo {
        cas: string[];
        students: string[];
    }

    export interface ISemesterRecitationInfo {
        [semester: string]: { [recitation: string]: IRecitationInfo };
    }

    export class DependencyGraphController implements IDependencyGraphController {
        public graph: Dagre.Graph;

        constructor($http: ng.IHttpService, $scope: IDependencyGraphScope) {
            $scope.dependencyGraphController = this;
            $http.get<string>("assets/CAFamilyData.csv").then((response) => {
                this.graph = this.constructGraph(response.data);
            });
        }

        private constructGraph(csvData: string) {
            // create CA -> semester taken 100/110/112 map
            var semesterRecitationInfo: ISemesterRecitationInfo  = { };

            var safeGet = (semester, recitation) => {
                if (!semesterRecitationInfo[semester]) {
                    semesterRecitationInfo[semester] = { };
                }

                if (!semesterRecitationInfo[semester][recitation]) {
                    semesterRecitationInfo[semester][recitation] = {
                        cas: [],
                        students: [],
                    };
                }
                return semesterRecitationInfo[semester][recitation];
            };

            var rows = csvData.split("\n").map((row) => row.split(","));
            var header = rows[0].map((column) => (column.indexOf("-") === -1) ? column : column.split("-")[0]);
            rows.slice(1).forEach((row) => {
                var name = row[0];
                var andrewId = row[1];
                var year = row[2];
                var recitation = row[3];
                if (year && recitation) {
                    safeGet(year, recitation).students.push(andrewId);
                }
                for (var semesterIndex = 4; semesterIndex < row.length; semesterIndex++) {
                    if (row[semesterIndex]) {
                        safeGet(header[semesterIndex], row[semesterIndex]).cas.push(andrewId);
                    }
                }
            });

            // create graph
            var graph = new dagreD3.graphlib.Graph()
                .setGraph({})
                .setDefaultEdgeLabel(() => { return { }; });

            var seenNodes = { };
            var addNode = (node) => {
                if (!seenNodes[node]) {
                    seenNodes[node] = true;
                    graph.setNode(node, { label: node, class: node });
                }
            };
            Object.keys(semesterRecitationInfo).forEach((semester) => {
                Object.keys(semesterRecitationInfo[semester]).forEach((recitation) => {
                    var recitationInfo = semesterRecitationInfo[semester][recitation];
                    if (recitationInfo.students.length > 0) {
                        recitationInfo.students.forEach(addNode);
                        recitationInfo.cas.forEach(addNode);
                    }

                    recitationInfo.cas.forEach((parent) => {
                        recitationInfo.students.forEach((child) => {
                            graph.setEdge(parent, child);
                        });
                    });
                });
            });

            console.log(rows);
            console.log(JSON.stringify(semesterRecitationInfo));

            return graph;
        }
    }

    caFamilyTree.controller("dependencyGraphController", DependencyGraphController);
}
