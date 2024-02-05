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

      while (currentNode.nextNode) {
        currentNode = currentNode.nextNode;
        currentKeys = Object.keys(currentNode);
        currentKeys.forEach((currentKey) => {
          if (currentKey === key) {
            currentNode[key] = value;
            duplicate = true;
          }
        });
      }

      if (!duplicate) {
        currentNode.nextNode = this.makeNode(key, value, currentNode);
      }

      const numberOfNodes = this.length();

      if (currentCapacity === numberOfNodes) {
        bucket.capacity += 8;
        currentCapacity = bucket.capacity * this.loadFactor;
      }
    }
  }

  get(key) {
    let nodeWithKey = this.findX(key, 'node');

    if (nodeWithKey) {
      return nodeWithKey[key];
    }
    return null;
  }

  has(key) {
    if (this.findX(key, 'node')) {
      return true;
    }
    return false;
  }

  remove(key) {
    let removed = false;

    // const bucketWithNode = this.findBucket(key);
    const bucketWithNode = this.findX(key, 'bucket');
    const bucketIndex = this.hashMap.indexOf(bucketWithNode);

    let nodeWithKey = this.findX(key, 'node');

    if (nodeWithKey) {
      // if only node in bucket, remove entire bucket
      if (nodeWithKey.previousNode === null && nodeWithKey.nextNode === null) {
        this.hashMap.splice(bucketIndex, 1);
        removed = true;
        // if node is head node
      } else if (nodeWithKey.previousNode === null) {
        bucketWithNode.head = nodeWithKey.nextNode;
        removed = true;
        // if node is tail node
      } else if (nodeWithKey.nextNode === null) {
        nodeWithKey.previousNode.nextNode = null;
        removed = true;
      } else if (nodeWithKey.previousNode && nodeWithKey.nextNode) {
        nodeWithKey.previousNode.nextNode = nodeWithKey.nextNode;
        nodeWithKey.nextNode.previousNode = nodeWithKey.previousNode;
        removed = true;
      }
    }

    return removed;
  }

  length() {
    let numberOfKeys = 0;

    const hMap = this.hashMap;
    hMap.forEach((bucket) => {
      let currentNode = bucket.head;
      numberOfKeys += 1;
      while (currentNode.nextNode) {
        currentNode = currentNode.nextNode;
        numberOfKeys += 1;
      }
    });

    return numberOfKeys;
  }

  clear() {
    this.hashMap = [];
  }

  keys() {
    const arrayOfKeys = [];

    const hMap = this.hashMap;
    hMap.forEach((bucket) => {
      let currentNode = bucket.head;
      let currentKeys = Object.keys(currentNode);
      currentKeys.forEach((currentKey) => {
        if (currentKey !== 'previousNode' && currentKey !== 'nextNode') {
          arrayOfKeys.push(currentKey);
        }
      });
      while (currentNode.nextNode) {
        currentNode = currentNode.nextNode;
        currentKeys = Object.keys(currentNode);
        currentKeys.forEach((currentKey) => {
          if (currentKey !== 'previousNode' && currentKey !== 'nextNode') {
            arrayOfKeys.push(currentKey);
          }
        });
      }
    });

    return arrayOfKeys;
  }

  makeNode(key, value = null, previousNode = null, nextNode = null) {
    return { [key]: value, previousNode, nextNode };
  }

  findX(key, X) {
    let find;
    if (X === 'node') {
      find = null;
    }

    const hMap = this.hashMap;
    hMap.forEach((bucket) => {
      let currentNode = bucket.head;
      let currentKeys = Object.keys(currentNode);
      currentKeys.forEach((currentKey) => {
        if (currentKey === key) {
          if (X === 'bucket') {
            find = bucket;
          } else if (X === 'node') {
            find = currentNode;
          }
        }
      });
      if (!find) {
        while (currentNode.nextNode) {
          currentNode = currentNode.nextNode;
          currentKeys = Object.keys(currentNode);
          currentKeys.forEach((currentKey) => {
            if (currentKey === key) {
              if (X === 'bucket') {
                find = bucket;
              } else if (X === 'node') {
                find = currentNode;
              }
            }
          });
        }
      }
    });

    return find;
  }
}

const hashMap = new HashMap(0.75);

hashMap.set('TestKey', 'TestValue');
hashMap.set('TestSet', 'TestValueToSet');
hashMap.set('TestGet', 'TestValueToGet');
hashMap.set('TestForMul', 'TestGetSecondNode');
hashMap.set('TestForT', 'TestGetThirdNode');
hashMap.set('TestRemove', 'TestRemovingANodeAndItsBucket');
hashMap.set('TestLength', 'TestLengthOfSix');

console.log(hashMap.get('TestGet'));
console.log(hashMap.get('TestForT'));

console.log(hashMap.has('Test'));

console.log(hashMap.remove('TestKey'));

console.log(hashMap.length());

// hashMap.clear();
// console.log(hashMap.hashMap);
// hashMap.set('TestClear', 'TestForAnActualNewHashMap');

console.log(hashMap.keys());

console.log(hashMap.hashMap);
