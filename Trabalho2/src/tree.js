function Node(id) {
    this.id = id;
    this.indexActiveMaterial = 0;
    this.materials = [];
    this.texture = null;
    this.mat = null;
    this.children = [];
    this.primitive = null;
}

Node.prototype.setTexture = function(texture) {
    this.texture = texture;
    for (var i = 0; i < this.materials.length; i++)
        this.materials[i].setTexture(texture);
}
