class GoL {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.running = false;
        this.createGUI();
        this.createBoard();
        this.bindEvents();
    }
    
    /**
     * Create Game GUI
     */
    createGUI() {
        let headline = $("<h3></h3>").html("Generation: <span id='gen'>1</span>");
        let nextButton = $("<button></button>").text("Next").attr("id", "next");
        let startButton = $("<button></button").text("Start").attr("id", "auto");

        $("body").append(headline, nextButton, startButton);
    }

    /**
     * Create table for game.
     */
    createBoard() {
        let tbl = document.createElement('table');
        tbl.style.border = '1px solid black';
        let tbdy = document.createElement('tbody');
        for (let i = 0; i < this.height; i++) {
            let tr = document.createElement('tr');
            for (let j = 0; j < this.width; j++) {
                let td = document.createElement('td');
                td.id = i + "-" + j
                td.style.border = "1px solid black";
                td.style.height = "20px";
                td.style.width = "20px";
                $(td).addClass("cell");
                td.appendChild(document.createTextNode('\u0020'))
                tr.appendChild(td)
          }
          tbdy.appendChild(tr);
        }
        tbl.appendChild(tbdy);
        $("body").append(tbl);
    }

    /**
     * Bind jquery events to gui.
     */
    bindEvents() {
        $(document).on("click", "#next", () => this.createNextGeneration());
        $(document).on("click", ".cell", function(){
	        $(this).toggleClass("alive");
        });
        $(document).on("click", "#auto", () => this.automated());
    }

    /**
     * Counting the living neighbors of the cell at the coordinate.
     * @param {int} y 
     * @param {int} x 
     */
    getAliveNeighborCount(y, x) {
        let count = 0;
        for(let i = -1; i < 2; i++){
            for(let j = -1; j < 2; j++){
                let temp_height = y + j;
                let temp_width = x + i;
                if(temp_height < 0 || temp_height > this.height
                    || temp_width < 0 || temp_width > this.width
                    || (i == 0 && j == 0)){
                    continue;
                }
                if($("#" + temp_height + "-" + temp_width).hasClass("alive")) {
                    count++;
                }
            }
        }
        return count;
    }

    /**
     * Create next Generation of current state of game.
     */
    createNextGeneration() {
        var gen = $("#gen");
        gen.html(parseInt(gen.html()) + 1);
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                var neighbors = this.getAliveNeighborCount(i, j);
                var current = $("#" + i + "-" + j);
                if((neighbors < 2 || neighbors > 3) && current.hasClass("alive")) {
                    current.addClass("next-dead");
                }
                else if(neighbors == 3 && !current.hasClass("alive")) {
                    current.addClass("next-alive");
                }
            }
        }
        
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                var current = $("#" + i + "-" + j);
                if(current.hasClass("next-dead")){
                    current.removeClass("next-dead").removeClass("alive");
                } else if(current.hasClass("next-alive")){
                    current.removeClass("next-alive").addClass("alive");
                }
            }
        }
    }

    /**
     * Run the game until called again
     */
    automated() {
        this.running = !this.running;
        if (this.running) {
            $("#auto").html("Pause");
            this.run();
        }
        else {
            $("#auto").html("Start");
        }
    }

    /**
     * Recursively calling itself until 'running' is set to false
     */
    run() {
        this.createNextGeneration();
        if (this.running){
            setTimeout(() => this.run(), 1000);
        }
    }
}

