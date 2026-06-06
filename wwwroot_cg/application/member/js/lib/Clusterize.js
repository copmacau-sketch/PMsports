(function(name, definition) {
        if (typeof module != "undefined")
            module.exports = definition();
        else if (typeof define == "function" && typeof define.amd == "object")
            define(definition);
        else
            this[name] = definition()
    }
)("Clusterize", function() {
    var ie = function() {
        for (var v = 3, el = document.createElement("b"), all = el.all || []; el.innerHTML = "\x3c!--[if gt IE " + ++v + "]><i><![endif]--\x3e",
            all[0]; )
            ;
        return v > 4 ? v : document.documentMode
    }()
        , is_mac = navigator.platform.toLowerCase().indexOf("mac") + 1;
    var sw = true;
    var Clusterize = function(data) {
        if (!(this instanceof Clusterize))
            return new Clusterize(data);
        var self = this;
        var defaults = {
            rows_in_block: 50,
            blocks_in_cluster: 4,
            tag: null,
            show_no_data_row: true,
            no_data_class: "clusterize-no-data",
            no_data_text: "No data",
            keep_parity: true,
            callbacks: {}
        };
        self.options = {};
        var options = ["rows_in_block", "blocks_in_cluster", "show_no_data_row", "no_data_class", "no_data_text", "keep_parity", "tag", "callbacks", "block_limit_height_S", "block_limit_height_M", "block_limit_height_L"];
        for (var i = 0, option; option = options[i]; i++)
            self.options[option] = typeof data[option] != "undefined" && data[option] != null ? data[option] : defaults[option];
        var elems = ["scroll", "content"];
        for (var i = 0, elem; elem = elems[i]; i++) {
            self[elem + "_elem"] = data[elem + "Id"] ? document.getElementById(data[elem + "Id"]) : data[elem + "Elem"];
            if (!self[elem + "_elem"])
                throw new Error("Error! Could not find " + elem + " element");
        }
        if (!self.content_elem.hasAttribute("tabindex"))
            self.content_elem.setAttribute("tabindex", 0);
        var rows = isArray(data.rows) ? data.rows : self.fetchMarkup()
            , cache = {}
            , scroll_top = self.scroll_elem.scrollTop;
        self.insertToDOM(rows, cache);
        self.scroll_elem.scrollTop = scroll_top;
        var last_cluster = false
            , scroll_debounce = 0
            , pointer_events_set = false
            , scrollEv = function() {
            if (is_mac) {
                if (!pointer_events_set)
                    self.content_elem.style.pointerEvents = "none";
                pointer_events_set = true;
                clearTimeout(scroll_debounce);
                scroll_debounce = setTimeout(function() {
                    self.content_elem.style.pointerEvents = "auto";
                    pointer_events_set = false
                }, 50)
            }
            if (last_cluster != (last_cluster = self.getClusterNum()))
                self.insertToDOM(rows, cache);
            if (self.options.callbacks.scrollingProgress)
                self.options.callbacks.scrollingProgress(self.getScrollProgress())
        }
            , resize_debounce = 0
            , resizeEv = function() {
            clearTimeout(resize_debounce);
            resize_debounce = setTimeout(self.refresh, 100)
        };
        on("scroll", self.scroll_elem, scrollEv);
        on("resize", window, resizeEv);
        self.destroy = function(clean) {
            off("scroll", self.scroll_elem, scrollEv);
            off("resize", window, resizeEv)
        }
        ;
        self.refresh = function(force) {
            if (self.getRowsHeight(rows) || force)
                self.update(rows, self.options.total_height, self.options.blockHeight, self.options.blockNum)
        }
        ;
        self.update = function(new_rows, total_h, blockHeight, blockNum) {
            self.options.prev_total_height = self.options.total_height;
            self.options.total_height = total_h;
            self.options.blockHeight = blockHeight;
            self.options.blockNum = blockNum;
            rows = isArray(new_rows) ? new_rows : [];
            var scroll_top = self.scroll_elem.scrollTop;
            if (rows.length * self.options.item_height < scroll_top)
                last_cluster = 0;
            self.options.block_ary = new Array;
            var tmp = 0;
            var _leng = self.options.blockHeight.length;
            for (var i = 0; i < _leng; i++) {
                self.options.block_ary.push(tmp);
                tmp += self.options.blockHeight[i]
            }
            self.insertToDOM(rows, cache)
        }
        ;
        self.updateRowHeight = function(new_rows, total_h, blockHeight) {
            self.options.prev_total_height = self.options.total_height;
            self.options.total_height = total_h;
            self.options.blockHeight = blockHeight;
            rows = isArray(new_rows) ? new_rows : [];
            self.options.block_ary = new Array;
            var tmp = 0;
            var _leng = self.options.blockHeight.length;
            for (var i = 0; i < _leng; i++) {
                self.options.block_ary.push(tmp);
                tmp += self.options.blockHeight[i]
            }
        }
        ;
        self.updateDOM = function(pageIndex, _height) {
            if (pageIndex < self.getClusterNum() - 1)
                self.updateTarget("top", _height);
            else if (pageIndex > self.getClusterNum() + 1)
                self.updateTarget("bottom", _height)
        }
        ;
        self.clear = function() {
            self.update([], 0, [], [])
        }
        ;
        self.getRowsAmount = function() {
            return rows.length
        }
        ;
        self.getScrollProgress = function() {
            return this.options.scroll_top / (rows.length * this.options.item_height) * 100 || 0
        }
        ;
        var add = function(where, _new_rows) {
            var new_rows = isArray(_new_rows) ? _new_rows : [];
            if (!new_rows.length)
                return;
            rows = where == "append" ? rows.concat(new_rows) : new_rows.concat(rows);
            self.insertToDOM(rows, cache)
        };
        self.append = function(rows) {
            add("append", rows)
        }
        ;
        self.prepend = function(rows) {
            add("prepend", rows)
        }
    };
    Clusterize.prototype = {
        constructor: Clusterize,
        fetchMarkup: function() {
            var rows = []
                , rows_nodes = this.getChildNodes(this.content_elem);
            while (rows_nodes.length)
                rows.push(rows_nodes.shift().outerHTML);
            return rows
        },
        exploreEnvironment: function(rows, cache) {
            var opts = this.options;
            opts.content_tag = this.content_elem.tagName.toLowerCase();
            if (!rows.length)
                return;
            if (ie && ie <= 9 && !opts.tag)
                opts.tag = rows[0].match(/<([^>\s/]*)/)[1].toLowerCase();
            if (this.content_elem.children.length <= 1)
                cache.data = this.html(rows[0] + rows[0] + rows[0]);
            if (!opts.tag)
                opts.tag = this.content_elem.children[0].tagName.toLowerCase()
        },
        getRowsHeight: function(rows) {
            var opts = this.options
                , prev_item_height = opts.item_height;
            if (!sw)
                opts.cluster_height = 0;
            if (!rows.length)
                return;
            var nodes = this.content_elem.children;
            if (!nodes.length)
                return;
            var node = nodes[Math.floor(nodes.length / 2)];
            opts.item_height = node.offsetHeight;
            if (opts.tag == "tr" && getStyle("borderCollapse", this.content_elem) != "collapse")
                opts.item_height += parseInt(getStyle("borderSpacing", this.content_elem), 10) || 0;
            if (opts.tag != "tr") {
                var marginTop = parseInt(getStyle("marginTop", node), 10) || 0;
                var marginBottom = parseInt(getStyle("marginBottom", node), 10) || 0;
                opts.item_height += Math.max(marginTop, marginBottom)
            }
            if (sw) {
                var tmp_height = 0;
                var scroll_height = 0;
                var next_height = 0;
                var block_num = (opts.blocks_in_cluster + 1) * opts.rows_in_block;
                var _num = this.getClusterNum();
                var total_page = Math.round(rows.length / opts.rows_in_block);
                var newNode = new Array;
                var _length = nodes.length;
                for (var k = 0; k < _length; k++) {
                    var node = nodes[k];
                    if (node && !node.classList.contains("clusterize-bottom-space") && !node.classList.contains("clusterize-top-space") && !node.classList.contains("clusterize-keep-parity"))
                        newNode.push(node)
                }
                var s = 0;
                var e = block_num;
                for (var i = s; i < e; i++) {
                    var node = newNode[i];
                    if (node && !node.classList.contains("clusterize-bottom-space") && !node.classList.contains("clusterize-top-space") && !node.classList.contains("clusterize-keep-parity"))
                        tmp_height += node.offsetHeight
                }
                scroll_height = opts.blockHeight[_num];
                opts.block_height = scroll_height;
                opts.rows_in_cluster = opts.blocks_in_cluster * opts.rows_in_block;
                opts.cluster_height = opts.block_height + next_height;
                opts.midBlock_height = tmp_height;
                return opts.prev_total_height != opts.total_height
            } else {
                opts.block_height = opts.item_height * opts.rows_in_block;
                opts.rows_in_cluster = opts.blocks_in_cluster * opts.rows_in_block;
                opts.cluster_height = opts.blocks_in_cluster * opts.block_height;
                return prev_item_height != opts.item_height
            }
        },
        getClusterNum: function() {
            this.options.scroll_top = this.scroll_elem.scrollTop;
            try {
                var _len = this.options.block_ary.length;
                for (var k = 0; k < _len; k++)
                    if (this.options.scroll_top >= this.options.block_ary[k] && (this.options.block_ary[k + 1] != null && this.options.scroll_top < this.options.block_ary[k + 1]))
                        return k;
                if (this.options.scroll_top < 0)
                    return 0;
                return _len - 2
            } catch (e) {
                return 0
            }
        },
        generateEmptyRow: function() {
            var opts = this.options;
            if (!opts.tag || !opts.show_no_data_row)
                return [];
            var empty_row = document.createElement(opts.tag), no_data_content = document.createTextNode(opts.no_data_text), td;
            empty_row.className = opts.no_data_class;
            if (opts.tag == "tr") {
                td = document.createElement("td");
                td.colSpan = 100;
                td.appendChild(no_data_content)
            }
            empty_row.appendChild(td || no_data_content);
            return [empty_row.outerHTML]
        },
        generate: function(rows, cluster_num) {
            var opts = this.options
                , rows_len = rows.length;
            if (rows_len < opts.rows_in_block)
                return {
                    top_offset: 0,
                    bottom_offset: 0,
                    rows_above: 0,
                    rows: rows_len ? rows : this.generateEmptyRow()
                };
            if (sw) {
                var count_midBlock = 0;
                var count_top = 0;
                for (var i = 0; i < cluster_num - 1; i++)
                    if (opts.blockHeight[i] != null)
                        count_top += opts.blockHeight[i];
                var prevHeight = opts.blockHeight[cluster_num - 1] != null ? opts.blockHeight[cluster_num - 1] : 0;
                var nextHeight = opts.blockHeight[cluster_num + 1] != null ? opts.blockHeight[cluster_num + 1] : 0;
                var midHeight = opts.blockHeight[cluster_num] != null ? opts.blockHeight[cluster_num] : 0;
                count_midBlock = prevHeight + midHeight + nextHeight;
                var items_start = Math.max(cluster_num - 2 >= 0 ? this.countAryVal(opts.blockNum, cluster_num - 2) : 0, 0)
                    , items_end = cluster_num + 1 <= opts.blockNum.length ? this.countAryVal(opts.blockNum, cluster_num + 1) : this.countAryVal(opts.blockNum, opts.blockNum.length)
                    , top_offset = Math.max(items_start != 0 ? count_top : 0, 0)
                    , bottom_offset = Math.max(opts.total_height - top_offset - count_midBlock, 0)
                    , this_cluster_rows = []
                    , rows_above = items_start
            } else
                var items_start = Math.max((opts.rows_in_cluster - opts.rows_in_block) * cluster_num, 0)
                    , items_end = items_start + opts.rows_in_cluster
                    , top_offset = Math.max(items_start * opts.item_height, 0)
                    , bottom_offset = Math.max((rows_len - items_end) * opts.item_height, 0)
                    , this_cluster_rows = []
                    , rows_above = items_start;
            if (top_offset < 1)
                rows_above++;
            for (var i = items_start; i < items_end; i++)
                rows[i] && this_cluster_rows.push(rows[i]);
            return {
                top_offset: top_offset,
                bottom_offset: bottom_offset,
                rows_above: rows_above,
                rows: this_cluster_rows
            }
        },
        renderExtraTag: function(class_name, height) {
            var tag = document.createElement(this.options.tag)
                , clusterize_prefix = "clusterize-";
            tag.className = [clusterize_prefix + "extra-row", clusterize_prefix + class_name].join(" ");
            height && (tag.style.height = height + "px");
            return tag.outerHTML
        },
        insertToDOM: function(rows, cache) {
            this.exploreEnvironment(rows, cache);
            var data = this.generate(rows, this.getClusterNum())
                , this_cluster_rows = data.rows.join("")
                , this_cluster_content_changed = this.checkChanges("data", this_cluster_rows, cache)
                , top_offset_changed = this.checkChanges("top", data.top_offset, cache)
                , only_bottom_offset_changed = this.checkChanges("bottom", data.bottom_offset, cache)
                , callbacks = this.options.callbacks
                , layout = [];
            if (this_cluster_content_changed || top_offset_changed) {
                if (data.top_offset) {
                    this.options.keep_parity && layout.push(this.renderExtraTag("keep-parity"));
                    layout.push(this.renderExtraTag("top-space", data.top_offset))
                }
                layout.push(this_cluster_rows);
                data.bottom_offset && layout.push(this.renderExtraTag("bottom-space", data.bottom_offset));
                callbacks.clusterWillChange && callbacks.clusterWillChange();
                this.html(layout.join(""));
                this.options.content_tag == "ol" && this.content_elem.setAttribute("start", data.rows_above);
                this.content_elem.style["counter-increment"] = "clusterize-counter " + (data.rows_above - 1);
                callbacks.clusterChanged && callbacks.clusterChanged()
            } else if (only_bottom_offset_changed)
                if (this.content_elem.lastChild.style)
                    this.content_elem.lastChild.style.height = data.bottom_offset + "px"
        },
        updateTarget: function(_target, _height) {
            var tarObj = this.content_elem.getElementsByClassName("clusterize-" + _target + "-space")[0];
            var tmpH = tarObj.style.height.replace(/px/, "") * 1;
            tarObj.style.height = tmpH + _height + "px"
        },
        html: function(data) {
            var content_elem = this.content_elem;
            if (ie && ie <= 9 && this.options.tag == "tr") {
                var div = document.createElement("div"), last;
                div.innerHTML = "<table><tbody>" + data + "</tbody></table>";
                while (last = content_elem.lastChild)
                    content_elem.removeChild(last);
                var rows_nodes = this.getChildNodes(div.firstChild.firstChild);
                while (rows_nodes.length)
                    content_elem.appendChild(rows_nodes.shift())
            } else
                content_elem.innerHTML = data
        },
        getChildNodes: function(tag) {
            var child_nodes = tag.children
                , nodes = [];
            for (var i = 0, ii = child_nodes.length; i < ii; i++)
                nodes.push(child_nodes[i]);
            return nodes
        },
        checkChanges: function(type, value, cache) {
            var changed = value != cache[type];
            cache[type] = value;
            return changed
        },
        countAryVal: function(ary, index) {
            var ret = 0;
            for (var i = 0; i <= index; i++)
                ret += ary[i];
            return ret
        }
    };
    function on(evt, element, fnc) {
        return element.addEventListener ? element.addEventListener(evt, fnc, false) : element.attachEvent("on" + evt, fnc)
    }
    function off(evt, element, fnc) {
        return element.removeEventListener ? element.removeEventListener(evt, fnc, false) : element.detachEvent("on" + evt, fnc)
    }
    function isArray(arr) {
        return Object.prototype.toString.call(arr) === "[object Array]"
    }
    function getStyle(prop, elem) {
        return window.getComputedStyle ? window.getComputedStyle(elem)[prop] : elem.currentStyle[prop]
    }
    return Clusterize
});