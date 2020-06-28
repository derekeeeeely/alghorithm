const { LinkList } = require('./index');

const link = new LinkList();

link.append(1);
link.append(2);
link.prepend(0);
link.append(3);
link.delete(2);
console.log('find 1: ', link.find(1));
console.log('find 2: ', link.find(2));
console.log('find 3: ', link.find(3));
console.log('find 4: ', link.find(4));
console.log(link);
link.traverse();
link.reverse();
link.traverse();