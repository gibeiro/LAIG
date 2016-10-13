function Tree(root){
	this.root = root;
	this.nodes = [];
	nodes[root] = new Node(root);
	this.stack = [];
}

function Node(id){
	this.id = id;
	this.parent = null;
	this.children = [];
	this.visited = false;
}

Tree.prototype.constructor = Tree;
Node.prototype.constructor = Node;

Tree.prototype.addNode = function(node){
	
	if(this.nodes[node.id] != null)
		this.nodes[node.id].children = node.children;
	else	
		this.nodes[node.id] = node;
	
	for(var i = 0; i < this.nodes[node.id].children.length; i++){
		this.addNode(new Node(this.nodes[node.id].children[i]));
		this.nodes[this.nodes[node.id].children[i]].parent = node.id;
	}	
	
}

Tree.prototype.removeNode = function(node){
	
	if(this.nodes[node.parent] != null)
		for(var i = 0; i < node.children.length; i++)
			this.nodes[node.children[i]].parent = node.parent;
	
	this.nodes[node.id] = null;
	
}

Tree.prototype.resetTraversal = function(){
	this.stack = [];
	for(var i = 0; i < nodes.length; i++)
		nodes[i].visited = false;
}

Tree.prototype.DFS = function(){
	if(this.stack.length == 0)
		this.stack.push(root);
	
	var id = stack.pop();
	
	if(nodes[id].visited){
		this.resetTraversal();
		return null;
	}		
	
	nodes[id].visited = true;
	
	for(var i = 0; i < node.children.length; i++)
		this.stack.push(node.children[i]);
	
	return node;	
}