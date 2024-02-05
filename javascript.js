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
        capacity: 16,
      };
    }
    let bucket = this.hashMap[index];
    let currentCapacity = bucket.capacity * this.loadFactor;

    let headNode = bucket.head;
    if (headNode.nextNode === undefined) {
      const newNode = this.makeNode(key, value);
      bucket.head = newNode;
    } else {
      let currentNode = headNode;

      let duplicate = false;
      let currentKeys = Object.keys(currentNode);
      currentKeys.forEach((currentKey) => {
        if (currentKey === key) {
          currentNode[key] = value;
          duplicate = true;
        }
      });

      let nodeCounter = 2;
      while (currentNode.nextNode) {
        currentNode = currentNode.nextNode;
        currentKeys = Object.keys(currentNode);
        currentKeys.forEach((currentKey) => {
          if (currentKey === key) {
            currentNode[key] = value;
            duplicate = true;
          }
        });
        nodeCounter += 1;
      }

      if (!duplicate) {
        currentNode.nextNode = this.makeNode(key, value, currentNode);
      }

      if (currentCapacity === nodeCounter) {
        bucket.capacity += 8;
        currentCapacity = bucket.capacity * this.loadFactor;
      }
    }
  }

  get(key) {
    let value = null;

    const hMap = this.hashMap;
    hMap.forEach((bucket) => {
      let currentNode = bucket.head;
      let currentKeys = Object.keys(currentNode);
      currentKeys.forEach((currentKey) => {
        if (currentKey === key) {
          value = currentNode[key];
        }
      });
      if (!value) {
        while (currentNode.nextNode) {
          currentNode = currentNode.nextNode;
          let currentKeys = Object.keys(currentNode);
          currentKeys.forEach((currentKey) => {
            if (currentKey === key) {
              value = currentNode[key];
            }
          });
        }
      }
    });

    return value;
  }

  makeNode(key, value = null, previousNode = null, nextNode = null) {
    return { [key]: value, previousNode, nextNode };
  }
}

const hashMap = new HashMap(0.75);

hashMap.set('TestKey', 'TestValue');
hashMap.set('TestSet', 'TestValueToSet');
hashMap.set('TestGet', 'TestValueToGet');
hashMap.set('TestForMul', 'TestGetSecondNode');
hashMap.set('TestForT', 'TestGetThirdNode');

console.log(hashMap.get('TestGet'));
console.log(hashMap.get('TestForT'));

console.log(hashMap.hashMap);
