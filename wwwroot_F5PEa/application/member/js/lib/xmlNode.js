function xmlNode(root) {
                _self = this;
                _self.Root = root;
                parentNode = _self.Root[0];
                _self.getParentNode = function() {
                    return parentNode
                }
                ;
                _self.getNode = function(node, auto) {
                    retNode = parentNode.getElementsByTagName(node);
                    parentNode = retNode[0];
                    if (auto == false)
                        return retNode;
                    if (retNode.length == 1)
                        return retNode[0];
                    else
                        return retNode
                }
                ;
                _self.Node = function(parentNode, node, auto) {
                    if (parentNode.length > 1) {
                        console.trace("where is XML error");
                        alert("DataNode error!!");
                        return
                    }
                    retNode = parentNode.getElementsByTagName(node);
                    if (auto == false)
                        return retNode;
                    if (retNode.length == 1)
                        return retNode[0];
                    else
                        return retNode
                }
                ;
                _self.removeMC = function() {}
            }
            ;