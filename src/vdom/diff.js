import render from './render';

const zip = (xs, ys) => {
    const zipped = [];
    for(let i = 0; i < Math.min(xs.length, ys.length); i++) {
        zipped.push([xs[i], ys[i]]);
    }
    return zipped;
};

const diffChildren = (oldVChildren, newVChildren) => {
    const childPatches = [];
    
    oldVChildren.forEach((oldVChild, i) => {
        childPatches.push(diff(oldVChild, newVChildren[i]));
    });

    const additionalPatches = [];
    for(const additionalVChild of newVChildren.slice(oldVChildren.length)) {
        additionalPatches.push($node => {
            $node.appendChild(render(additionalVChild));
            return $node;
        });
    };

    return $parent => {
        for(const [patch, $child] of zip(childPatches, $parent.childNodes)) {
            patch($child);
        }

        for(const patch of additionalPatches) {
            patch($parent);
        }
        return $parent;
    };
};


const diffAttrs = (oldAttrs, newAttrs) => {
    const patches = [];
  
    for(const [key, value] of Object.entries(newAttrs)) {
        patches.push($node => {
            $node.setAttribute(key, value);
            return $node;
        });
    }

    for(const key in oldAttrs) {
        if(!(key in newAttrs)) {
            patches.push($node => {
                $node.removeAttribute(key);
                return $node;
            });
        }
    }
  
    return $node => {
        for(const patch of patches) {
            patch($node);
        }
            return $node;
    };
};

const diff = (oldVTree, newVTree) => {
    if(newVTree === undefined) {
        return $node => {
            $node.remove();
            return undefined;
        }
    }

    if(typeof oldVTree === 'string' || typeof newVTree === 'string') {
        if(oldVTree !== newVTree) {
            return $node => {
                const $newNode = render(newVTree);
                $node.replaceWith($newNode);
                return $newNode;
            };
        } else {
            return $node => $node;
        }
    }

    if(oldVTree.tagName !== newVTree.tagName) {
        return $node => {
            const $newNode = render(newVTree);
            $node.replaceWith($newNode);
            return $newNode;
        };
    }

    const patchAttrs = diffAttrs(oldVTree.attrs, newVTree.attrs);
    const patchChildren = diffChildren(oldVTree.children, newVTree.children);

    return $node => {
        patchAttrs($node);
        patchChildren($node);
        return $node;
    };
};

export default diff;