define(['zepto', 'random'], function($, r) {

    var rows = 10, cols = 10, bombs = 10, gameTable, putBombs = function() {
        var bCount = bombs, x, y, curr;

        while(bCount > 0) {
            y = r.getRandomInt(0, rows-1);
            x = r.getRandomInt(0, cols-1);
            curr = gameTable[y][x];
            if (!curr.hasBomb) {
                curr.hasBomb = true;
                bCount--;
            }
        }

        //gameTable[4][4].hasBomb = true;
    },
    resetGame = function() {
        var i;

        $('.game-area').children().remove();
        gameTable = [];

        for (i = 0; i < rows; i++) {
            gameTable.push(addRow(i));
        }

        putBombs();
    }, 
    addRow = function(yIdx) {
        var row = $('<tr></tr>'), i, col, datarow = [];

        for (i = 0; i < cols; i++) {
            col = {
                e: $('<td data-x="' + i + '" data-y="' + yIdx + '"></td>'),
                hasBomb: false,
                x: i,
                y: yIdx
            };
            row.append(col.e);
            datarow.push(col);
        }

        $('.game-area').append(row);
        return datarow;
    }, 
    getNeighbors = function(x, y) {
        var tileArr = [], i, j, curRow, curCol;
        for (i = 0; i < 3; i++) {
            if (i+y-1 < 0 || i+y-1 >= rows) {
                continue;
            }
            curRow = gameTable[i-1+y];
            for (j = 0; j < 3; j++) {
                if (i == 1 && j == 1 || j+x-1 < 0 || j+x-1 >= cols) {
                    continue;
                } 
                curCol = curRow[j-1+x];
                tileArr.push(curCol);
            }
        }
        return tileArr;
    }, 
    findBombs = function(x, y) {
        var bombCount = 0, i, neighbors = getNeighbors(x, y), cur;

        for (i = 0; i < neighbors.length; i++) {
            cur = neighbors[i];
            if (cur.hasBomb) {
                bombCount++;
            }
        }
        return bombCount;
    }, 
    reveal = function(x, y) {
        var bombsFound, i, neighbors, curr, data = gameTable[y][x];

        if(data.e.hasClass('revealed')) {
            return;
        }
        bombsFound = findBombs(x, y);

        data.e.addClass('revealed');
        data.e.text(bombsFound < 1 ? '' : bombsFound);
        if (bombsFound < 1) {
            neighbors = getNeighbors(x, y);
            for (i = 0; i < neighbors.length; i++) {
                curr = neighbors[i];
                reveal(curr.x, curr.y);
            }
        }
    };

    $(document).on('click', '.game-area td', function() {
        var $e = $(this),
            x = $e.data('x'),
            y = $e.data('y'),
            data = gameTable[y][x];

        if(data.hasBomb) {
            $e.addClass('bomb');
        } else {
            reveal(x, y);
        }
    });

    $(document).on('click', '.game-reset', function() {
        resetGame();
    });

    resetGame();

});