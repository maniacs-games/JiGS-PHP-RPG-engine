var game = new Phaser.Game(800, 500, Phaser.AUTO, "world", null, true, true, null);
var upKey;
var downKey;
var leftKey;
var rightKey;
var x = 100;
var y = 100;
var fireButton;
var weapon;
var cursors;
var sprite;
var sprite2;
var circle_core;
var anim= false;
var dest;
var bar;
var text;
var enableObstacleCollide;
var collideBuilding =[];
var collidePlate =[];
var collideTerminal=[];
var collidePortal=[];
collideBuilding[0]=false;
collideBuilding[1]=false;
collidePlate[0]=false;
collidePlate[1]=false;
collidePlate[2]=false;
collidePlate[3]=false;
collidePlate[4]=false;
collidePlate[5]=false;

collideTerminal[0]=false;
collideTerminal[1]=false;
collideTerminal[2]=false;
collideTerminal[3]=false;
collideTerminal[4]=false;
collideTerminal[5]=false;

collidePortal[1]=false;
collidePortal[2]=false;
collidePortal[3]=false;

game.state.add('login', playState[0]);
game.state.add('next', playState[3]);
game.state.add('terminal', playState[2]);

getGrid();
//All parameters are optional but you usually want to set width and height
//Remember that the game object inherits many properties and methods!


function getGrid() {


    jQuery.getJSON('index.php?option=com_battle&task=map_action&action=get_grid&format=raw', function (result) {
        if (result != null) {

            grid = parseInt(result[0]);
            new_x = parseFloat(result[1]);
            new_y = parseFloat(result[2]);
            avatar = result[3];
            get_everything(grid);
        } else {
            grid = 1;
            new_x = 100;
            new_y = 100;
            avatar = null;
            get_everything(grid);
        }
    });


}
if (grid==1){

}
else {


    var conn = new ab.Session('ws://www.eclecticmeme.com:8080', function () {

            conn.subscribe('monstersCategory', function (topic, data) {
                data.article.forEach(function (articleObj) {
                    var incomingId = articleObj.id;
                    monsters_list.forEach(function (monsterObj, index) {
                        if (monsterObj.id == incomingId) {
                            monsterObj.x = parseInt(articleObj.x);
                            monsterObj.y = parseInt(articleObj.y);
                            if (monsters[incomingId] !== undefined) {

                                //   console.log('moved');
                                game.physics.arcade.moveToXY(monsters[incomingId], parseInt(monsterObj.x), parseInt(monsterObj.y), 100);
                            }
                        }
                    });
                });
            });
            conn.subscribe('monsterHealthCategory', function (topic, data) {
                //    console.log(data);
            });

            conn.subscribe('halflingsCategory', function (topic, data) {
                data.article.forEach(function (articleObj) {
                    var incomingId = articleObj.id;
                    halfling_list.forEach(function (halflingObj, index) {
                        if (halflingObj.id == incomingId) {
                            halflingObj.x = parseInt(articleObj.x);
                            halflingObj.y = parseInt(articleObj.y);
                            if (halflings[incomingId] !== undefined) {
                                game.physics.arcade.moveToXY(halflings[incomingId], parseInt(halflingObj.x), parseInt(halflingObj.y), 100);
                            }
                        }
                    });
                });
            });
            conn.subscribe('playersCategory', function (topic, data) {
                for (var iterate = 0; iterate <= data.article.length - 1; iterate++) {
                    var incomingId = data.article[iterate].id;
                    players_list.forEach(function (playerObj, index) {
                        if (playerObj.id == incomingId) {
                            playerObj.posx = parseInt(data.article[iterate].posx);
                            playerObj.posy = parseInt(data.article[iterate].posy);
                            players[incomingId].body.velocity.x = 1000;
                            players[incomingId].body.velocity.y = 1000;
                            game.physics.arcade.moveToXY(players[incomingId], parseInt(playerObj.posx), parseInt(playerObj.posy), 100);
                        }
                    });
                }
                ;
            });
        },

        function () {
            console.warn('WebSocket connection closed');
        },
        {'skipSubprotocolCheck': true}
    );

    jQuery('#world').focus().blur(function () {
        jQuery('#world').focus();
    })




    function collisionProperty(thingy) {

   //     console.log('type: ' + thingy.type);

        if (thingy.type == 'buildings') {


            collideBuilding[thingy.dest] = true;
        }
        if (thingy.type == 'terminals') {

            collideTerminal[thingy.dest] = true;
        }

        if (thingy.type == 'portals') {

            collidePortal[thingy.dest] = true;
        }

        else {
            collidePlate[thingy.dest] = true;
        }

        //return  game.physics.arcade.collide(sprite, thingy , enter_building);
        killTooltip(thingy);
    }

    function killTooltip(thingy) {
        text.destroy();
        bar.destroy();

        text = false;
        bar = false;

    }

    function whatever(arg) {
        killTooltip(arg);
        alert(arg.name);

    }


    function moveBall(pointer) {
        collideBuilding[0] = false;
        send = 1;
        x = parseInt(pointer.worldX);
        y = parseInt(pointer.worldY);
    }

    function jump(one, two) {

        one.body.immovable = true;
        one.body.enable = false;
        two.body.immovable = true;
        two.body.enable = false;

        anim = false;
        var source = grid;

        grid = two.dest;

        if (source == portal_dest_1[grid]) {
            new_x = portal_sourceX1[grid];
            new_y = portal_sourceY1[grid];
            x = portal_sourceX1[grid];
            y = portal_sourceY1[grid];
        }
        if (source == portal_dest_2[grid]) {
            new_x = portal_sourceX2[grid];
            new_y = portal_sourceY2[grid];
            x = portal_sourceX2[grid];
            y = portal_sourceY2[grid];
        }

        if (source == portal_dest_3[grid]) {
            new_x = portal_sourceX3[grid];
            new_y = portal_sourceY3[grid];
            x = portal_sourceX3[grid];
            y = portal_sourceY3[grid];
        }
        one.body.velocity.x = 0;
        one.body.velocity.y = 0;

        get_everything(two.grid);
    }

    function get_everything(dest) {

        //  alert('sh');

        jQuery.getJSON('index.php?option=com_battle&task=map_action&action=get_buildings&format=raw&grid=' + dest, function (result) {
            buildings = result;

            jQuery.getJSON('index.php?option=com_battle&task=map_action&action=get_chars&format=raw', function (result) {
                npc_list = result;

                jQuery.getJSON('index.php?option=com_battle&task=map_action&action=get_players&format=raw', function (result) {
                    players_list = result;

                    jQuery.getJSON('index.php?option=com_battle&task=map_action&action=get_twines&format=raw', function (result) {
                        twines_list = result;

                        jQuery.getJSON('index.php?option=com_battle&task=map_action&action=get_terminals&format=raw', function (result) {
                            terminals_list = result;

                            jQuery.getJSON('index.php?option=com_battle&task=map_action&action=get_plates&format=raw', function (result) {
                                plates_list = result;

                                jQuery.getJSON('index.php?option=com_battle&task=map_action&action=get_monsters&format=raw', function (result) {
                                    monsters_list = result;

                                    jQuery.getJSON('index.php?option=com_battle&task=map_action&action=get_halflings&format=raw', function (result) {
                                        halfling_list = result;

                                        grid = dest;
                                        game.state.start('login');

                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    function battle(one, two) {
        game.state.add('next', loadState);
        game.state.start('next');
    }

    function battle1(one, two) {
        grid = 7;
        game.state.add('next', playState[7]);
        game.state.start('next');
    }

    function battle2(one, two) {
        grid = 8;
        game.state.add('next', playState[8]);
        game.state.start('next');
    }

    function enter_building(one, two) {
        if (two.id == undefined) {
            two.id = 62;
        }
        alert('enter building');
        enableObstacleCollide = false;
        one.body.immovable = true;
        one.body.enable = false;
        jQuery.ajax({
            url: "/index.php?option=com_battle&format=json&view=building&id=" + two.id,
            context: document.body,
            obj: one.body.enable,
            dataType: "json"
        }).done(function (result) {

            document.getElementById("building").innerHTML = result;
            document.getElementById("building").show();
            document.getElementById("world").hide();
            document.getElementById("npc").hide();
            document.getElementById("player").hide();
            loadUp();
            var url = "/components/com_battle/includes/building.js";
            jQuery.getScript(url, function () {
                // alert ('hi');
                success2();
            });
        });
    }

    function shop(one, two) {
        one.destroy(true);
        one.body.enable = false;
        two.body.enable = false;
        jQuery.ajax({
            url: "/index.php?option=com_battle&format=json&view=building&id=1739",
            context: document.body,
            dataType: "json"
        }).done(function (result) {
            document.getElementById("mainbody").innerHTML = result;
            //   document.getElementById('loadarea_0').src= '/components/com_battle/includes/building.js';
            var url = "/components/com_battle/includes/building.js";
            jQuery.getScript(url, function () {

                success2();
            });
            //	mything.replaces(document.id('world'));
        });
    }

    function church() {
        window.location.assign("/index.php?option=com_wrapper&view=wrapper&Itemid=404")
    }

    function collideNpc(one, two) {
        two.body.enable = false;

        jQuery.ajax({
            url: "/index.php?option=com_battle&format=json&view=character&id=" + two.key_id,
            context: document.body,
            dataType: "json"
        }).done(function (result) {
            two.body.enable = true;
            document.getElementById("npc").innerHTML = result;
            document.getElementById("npc").show();
            document.getElementById("world").hide();
            document.getElementById("building").hide();
            document.getElementById("player").hide();
            loadUp();
            var url = "/components/com_battle/includes/character.js";
            jQuery.getScript(url, function () {

            });

        });
    }

    function collideMonster(one, two) {

        monsters[two.id].body.enable = false;
        //console.log('attacked!');
        jQuery.ajax({
            url: "/index.php?option=com_battle&format=json&task=monster_action&action=attack&id=" + two.id,
            context: document.body,
            dataType: "json"
        }).done(function (result) {
            console.log('attacked!');
            monsters[two.id].health = monsters[two.id].health - 10;
            if (monsters[two.id].health < 0) {
                monsters[two.id].alpha = 0;
            }
            else {
                monsters[two.id].body.enable = true;
            }
        });
        return monsters[two.id];
    }

///////////////////////////////////////////////////////////////////////////////////////
    function page(one, two) {
        // two.body.enable =false;
        jQuery.ajax({
            url: "/index.php?option=com_battle&format=json&view=twine&id=" + two.key,
            context: document.body,
            dataType: "json"
        }).done(function (result) {
            //   two.body.enable =true;
            document.getElementById("mainbody").innerHTML = result;
            //loadUp();//not yet

        });
    }

///////////////////////////////////////////////////////////////////////////////////////
    function plate(one, two) {

        return function () {

            //alert(two);

            one.body.immovable = true;
            one.body.enable = false;
            two.body.immovable = true;
            two.body.enable = false;

            jQuery.ajax({
                //  url: "/index.php?option=com_battle&format=json&task=plate_action$action=getplate&id="+ two.key,

                url: "/index.php?option=com_battle&format=json&view=plate&id=" + two.key,
                context: document.body,
                dataType: "json"
            }).done(function (result) {
                //   two.body.enable =true;
                document.getElementById("world").hide();
                document.getElementById("plates").innerHTML = result;
                document.getElementById("plates").show();
                //loadUp();//not yet

            });

        }();


    }

///////////////////////////////////////////////////////////////////////////////////////
    function twine(one, two) {

        one.body.immovable = true;
        one.body.enable = false;
        two.body.immovable = true;
        two.body.enable = false;
        jQuery.ajax({
            url: "/index.php?option=com_battle&format=json&view=twine&id=" + two.key,
            context: document.body,
            dataType: "json"
        }).done(function (result) {
            //   two.body.enable =true;
            document.getElementById("mainbody").innerHTML = result;
            //loadUp();//not yet

        });
    }

//////////////////////////////////////////////////////////////////////////////////////
    function terminal(one, two) {
        one.body.enable = false;
        one.body.immovable = true;
        two.body.static = true;

        jQuery.ajax({
            url: "/index.php?option=com_battle&format=json&view=terminal&id=" + two.id,
            context: document.body,
            dataType: "json"
        }).done(function (result) {
            //   two.body.enable = true;
            game.state.start('terminal');
            //  document.getElementById("world").hide();
            document.getElementById("terminal").innerHTML = result;
            document.getElementById("terminal").show();
            loadUp();
            var url = "/components/com_battle/includes/terminal.js";
            jQuery.getScript(url, function () {
            });
        });
    }

//////////////////////////////////////////////////////////////////////////////////////
    function player(one, two) {
        // two.body.enable = false;

        jQuery.ajax({
            url: "/index.php?option=com_battle&format=json&view=player&id=" + two.key_id,
            context: document.body,
            dataType: "json"
        }).done(function (result) {
            //   two.body.enable = true;
            document.getElementById("mainbody").innerHTML = result;
            loadUp();
            var url = "/components/com_battle/includes/player.js";
            jQuery.getScript(url, function () {
            });
        });
    }

/////////////////////////////////////////////////////////////////////////////////////

    function paddy(n, p, c) {
        var pad_char = typeof c !== 'undefined' ? c : '0';
        var pad = new Array(1 + p).join(pad_char);
        return (pad + n).slice(-pad.length);
    }

    function addMap() {

        map = game.add.tilemap('world');
        layer3 = map.createLayer('ground');
        layer = map.createLayer('obstacles');
        layer4 = map.createLayer('ground2');
        layer2 = map.createLayer('objects');
    }

    function loaded() {

    }

    function doSomething() {
        if (x != undefined) {
            jQuery.getJSON('index.php?option=com_battle&task=map_action&action=update_pos&format=raw&posx=' + sprite.body.x + '&posy=' + sprite.body.y, function (result) {

            });
        }
    }






    function updateLine() {
        //console.log(introDateTime);
        if (line.length < introDateTime[index].length) {
            line = introDateTime[index].substr(0, line.length + 1);
            // text.text = line;
            dateTime.setText(line);
        }
        else {
            //  Wait 2 seconds then start a new line
            game.time.events.add(Phaser.Timer.SECOND * 2, nextLine, this);
        }
    }

    function nextLine() {
        index++;
        if (index < introDateTime.length) {
            line = '';
            game.time.events.repeat(80, introDateTime[index].length + 1, updateLine, this);
        }
    }





    function nextLine2() {
        if (lineIndex === content.length) {
            //  We're finished
            return;
        }
        //  Split the current line on spaces, so one word per array element
        line2 = content[lineIndex].split(' ');
        //  Reset the word index to zero (the first word in the line)
        wordIndex = 0;
        //  Call the 'nextWord' function once for each word in the line (line.length)
        game.time.events.repeat(wordDelay, line2.length, nextWord, this);
        //  Advance to the next line
        lineIndex++;
    }

    function nextWord() {
        //  Add the next word onto the text string, followed by a space
        introText.text = introText.text.concat(line2[wordIndex] + " ");
        //  Advance the word index to the next word in the line
        wordIndex++;
        //  Last word?
        if (wordIndex === line2.length) {
            //  Add a carriage return
            introText.text = introText.text.concat("\n");
            //  Get the next line after the lineDelay amount of ms has elapsed
            game.time.events.add(lineDelay, nextLine2, this);
        }

    }



    function slowIntroText() {
        nextLine2();
    }

    function clearAlert() {
        window.clearTimeout(timeoutID);
    }

















}
