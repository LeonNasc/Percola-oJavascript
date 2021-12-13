const container = document.getElementById("grid");
    const janela = document.querySelector("#main_cont");
    const gridSize = 128;

    function generateRows() {
        makeRows(gridSize, gridSize);
        janela.style.borderColor = "gray"
    }

    function makeRows(rows, cols) {

        container.innerHTML = "";

        try {
            var threshold = document.getElementById("#prob_perc").value / 100;
        }
        catch {
            threshold = 0.5;
        }

        container.style.setProperty('--grid-rows', rows);
        container.style.setProperty('--grid-cols', cols);
        for (c = 0; c < (rows * cols); c++) {
            let cell = document.createElement("div");
            cell.id = "c_" + (c)
            let prob = Math.random();
            cell.style.backgroundColor = prob > threshold ? "#FFFFFF" : "#000000";
            cell.style.color = prob > threshold ? "#FFFFFF" : "#000000";
            cell.innerHTML = prob > threshold ? "a" : "b";
            container.appendChild(cell).className = "grid-item";
        };
    };

    window.onload = makeRows(gridSize, gridSize);

    function BFS(grid, size = gridSize, visitados = new Set) {

        if (grid == null || grid == undefined) {
            grid = []
            for(var i = 0, ll = gridSize; i!= ll; grid.push(container.childNodes[i++]));
        }

        if (VerificarCondicaoDeParada(grid, visitados))
            return;

        var a_visitar = new Set()

        for (let item of grid) {
            if (item != undefined) {
                index = Number(item.id.split("_")[1])
            }

            if (isOpen(item)) {
                let visitas = obterVizinhos(index)
                a_visitar = uniao(a_visitar, new Set(visitas));
                visitados.add(item);
            }
        }
        a_visitar = diferenca(a_visitar, visitados);

        colorirCelulas(visitados)

        var novos = BFS(a_visitar, a_visitar.size, visitados);
        return visitados;
    }

    function VerificarCondicaoDeParada(grid, visitados) {

        try {
            if (grid.size == 0)
                return true;
        }
        catch {
            if (grid.length == 0) {
                return true;
            }
        }
        if (ChecarPercolacao(visitados)) {
            return true;
        }

        return false;
    }

    function colorirCelulas(path) {
        path.forEach((v) => v.style.backgroundColor = "blue")
        path.forEach((v) => v.style.color = "blue")
    }

    function ChecarPercolacao(path) {
        var ultima_linha = (gridSize*gridSize) - gridSize;

 
        for (let cell of path){
            if(cell.id.split("_")[1] > ultima_linha){
                janela.style.borderColor = "green";
                return;
            }
        }

        janela.style.borderColor = "red";
    }

    function obterVizinhos(index){
        var left = (index) => index - 1 > 0 ? index - 1 : null;
        var right = (index) => index + 1 < (gridSize * gridSize) - 1 ? index + 1 : null;
        var down = (index) => index + gridSize < (gridSize * gridSize) - 1 ? index + gridSize : null;
        var main_grid = container.childNodes;

        return [main_grid[left(index)], main_grid[right(index)], main_grid[down(index)]].
                    filter(c => c != null).
                    filter(c => isOpen(c))
    }

    function isOpen(cell) {
        if (cell) {
            let valida = cell.innerHTML == "a";
            return valida;
        }
        return false;
    }

    function uniao(setA, setB) {
        var _uniao = new Set(setA);
        for (var elem of setB) {
            _uniao.add(elem);
        }
        return _uniao;
    }
    function diferenca(setA, setB) {
        var _diferenca = new Set(setA);
        for (var elem of setB) {
            _diferenca.delete(elem);
        }
        return _diferenca;
    }

    function mostrar_valor(){
        var threshold = document.getElementById("#prob_perc").value / 100;
        document.querySelector("#prob_vis").innerText = 1 - threshold;
    }
