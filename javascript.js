// whenever you access a bucket through an index
// if (index < 0 || index >= buckets.length) {
//   throw new Error('Trying to access index out of bound');
// }

class HashMap {
  constructor(loadFactor) {
    this.hashMap = [];
    this.loadFactor = loadFactor;
  }

  hash(string) {
    let hashCode = 0;

    const primeNumber = 31;
    for (let i = 0; i < string.length; i++) {
      hashCode = (primeNumber * hashCode + string.charCodeAt(i)) % 16;
    }

    return hashCode;
  }

  set(key, value) {
    const index = this.hash(key);

    if (this.hashMap[index] === undefined) {
      this.hashMap[index] = {
        head: {},
      };
    }
    let bucket = this.hashMap[index];

    let headNode = bucket.head;
    if (headNode.nextNode === null) {
      const newNode = this.makeNode(key, value);
      bucket.head = newNode;
    } else {
      let currentNode = headNode;
      while (currentNode.nextNode) {
        currentNode = currentNode.nextNode;
      }
      currentNode.nextNode = this.makeNode(key, value, currentNode);
    }
  }

  makeNode(key, value = null, previousNode = null, nextNode = null) {
    return { [key]: value, previousNode, nextNode };
  }
}

const hashMap = new HashMap(16, 0.75);

hashMap.set('TestKey', 'TestValue');
hashMap.set('TestForT', 'TestForTwoNodes');
hashMap.set('TestForMul', 'TestForThreeNodes');
hashMap.set('TestForMul', 'TestForOverwrite');

console.log(hashMap.hashMap);
