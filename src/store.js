(function(){
  let id = Date.now();
  let start = id;
  let set = 1;
  let max = 500;
  let clearId = setInterval(function(){
    const url = `https://robohash.org/${id}.png?set=set${set}&size=100x100`;
    window.jQuery('body').append(`<img src="${url}" width=100 height=100 />`);
    id = id + 1;
    set = set + 1;
    if (start > (start + max)) clearInterval(clearId);
    if (set > 5) set = 1;
  }, 250);
}());

/*
Robots 1
Monster 2
Heads 3
KITTYs 4


Robots > Monsters
Monster > Kittys
Kittys > Heads
Heads > Robots

Robots = Kittys
Monsters = Heads



KITTYs beat ROBOT HEADs
ROBOTs HEADs beats ROBOTs
ROBOTs beats Monsters
Monster beats Kittys
*/
