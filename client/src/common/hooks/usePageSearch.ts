import { useEffect } from 'react';

export const usePageSearch = (searchQuery: string) => {
    useEffect(() => {
        if (!searchQuery.trim()) {
            document.querySelectorAll('mark').forEach((mark) => {
                const parent = mark.parentNode;
                if (parent) {
                    while (mark.firstChild) {
                        parent.insertBefore(mark.firstChild, mark);
                    }
                    parent.removeChild(mark);
                }
            });
            return;
        }

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
        );

        const nodesToReplace: Array<{ node: Node; parent: Node }> = [];
        let currentNode;

        while ((currentNode = walker.nextNode())) {
            if (
                currentNode.textContent &&
                currentNode.textContent
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            ) {
                nodesToReplace.push({
                    node: currentNode,
                    parent: currentNode.parentNode!,
                });
            }
        }

        nodesToReplace.forEach(({ node, parent }) => {
            const regex = new RegExp(`(${searchQuery})`, 'gi');
            const html = node.textContent!.replace(
                regex,
                '<mark class="bg-yellow-300 font-semibold">$1</mark>',
            );
            const span = document.createElement('span');
            span.innerHTML = html;
            parent.replaceChild(span, node);
        });
    }, [searchQuery]);
};
