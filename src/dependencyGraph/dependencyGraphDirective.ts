module CAFamilyTree.DependencyGraph {

    export class DependencyGraphDirective implements ng.IDirective {
        public controller = "dependencyGraphController";
        public replace = true;
        public restrict = "E";
        public templateUrl = "src/dependencyGraph/dependencyGraphTemplate.html";

        public link = ($scope: IDependencyGraphScope, element: JQuery) => {
            var watchOnce = $scope.$watch(() => {
                return $scope.dependencyGraphController.graph;
            }, (graph: Dagre.Graph) => {
                if (graph != null) {
                    var render = new dagreD3.render();
                    var svg = d3.select(element.get(0)).append("svg");
                    svg.attr("width", "100%");
                    svg.attr("height", "100%");
                    var svgGroup = svg.append("g");
                    render(d3.select("svg g"), graph);

                    // compute scale in/out
                    var svgJQuery = $(element).find("svg");
                    var width = svgJQuery.width();
                    var height = svgJQuery.height();
                    var scale = 1.0;
                    if (graph.graph().width > width || graph.graph().height > height) {
                        var innerScale = 0.75;
                        scale = Math.min(width / graph.graph().width * innerScale, height / graph.graph().height * innerScale);
                    }

                    // Center the graph
                    var xCenterOffset = (width - graph.graph().width * scale) / 2;
                    var yCenterOffset = (height - graph.graph().height * scale) / 2;
                    svgGroup.attr("transform", "translate( " + xCenterOffset + ", " + yCenterOffset + ")" + "scale(" + scale + ")");

                    // set up zoom
                    var zoom = d3.behavior.zoom().on("zoom", function() {
                        svgGroup.attr("transform", "translate(" + d3.event.translate + ")" +
                            "scale(" + d3.event.scale + ")");
                    });
                    svg.call(zoom);
                    zoom.translate([xCenterOffset, yCenterOffset]).scale(scale);
                    watchOnce();
                }
            });
        };
    }

    caFamilyTree.directive("dependencyGraph", () => new DependencyGraphDirective());
}
