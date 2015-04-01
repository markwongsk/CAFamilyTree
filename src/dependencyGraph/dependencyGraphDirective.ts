module CAFamilyTree.DependencyGraph {

    export class DependencyGraphDirective implements ng.IDirective {
        public controller = "dependencyGraphController";
        public replace = true;
        public restrict = "E";
        public templateUrl = "src/dependencyGraph/dependencyGraphTemplate.html";
    }

    caFamilyTree.directive("dependencyGraph", () => new DependencyGraphDirective());
}
