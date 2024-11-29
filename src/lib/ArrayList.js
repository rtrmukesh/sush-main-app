class ArrayList {
    // Array List is Empty
    static isEmpty = (arrayList) => {
      if (arrayList && arrayList.length == 0) {
        return true;
      } else {
        return false;
      }
    };
  
    // Array List is Not Empty
    static isNotEmpty = (arrayList) => {
      return !this.isEmpty(arrayList);
    };
    /**
   * Is data False
   * @param value
   */
  
    /**
     * Is Any String in Array Exist In Array
     * @param array1
     * @param array2
     */
    static isAnyStringInArrayExistInArray(array1, array2) {
      if (isEmpty(array1) || isEmpty(array2)) {
        return false;
      }
  
      array1.forEach((string1) => {
        if (isStringExistInArray(array2, string1)) {
          return true;
        }
      });
  
      return false;
    }
    static arrayToArrayFilter = (array1, array2) => {
      if (!array1 && !array2) {
        return null;
      }
      let filteredArray = array1.filter((list) => array2.includes(list));
      return filteredArray;
    }
  
    /**
     * Is Any String Exist In Array
     * @param array
     * @param string
     */
    static isStringExistInArray(array, string) {
      if (isEmpty(array)) {
        return false;
      }
      let result = false;
      array.forEach((string1) => {
        if (string1.trim() === string.trim()) {
          result = true;
        }
      });
      return result;
    }
    static compareArrayInArray = (array, array1) => {
      array1.forEach((value) => {
        var value1 = array.indexOf(value);
        if (value1 === -1) {
          array.push(value);
        } else {
          array.splice(value1, 1);
        }
      });
      return array;
    }
  
    static getKeyByValue(object, value) {
      let isSelected = false;
      for (const key in object) {
        if (key == value) {
          isSelected = object[key] == true ? true : false;
        }
      }
      return isSelected;
    }
    static sort = (data, sort, sortDirection) => {
      if (!Array.isArray(data)) {
        throw new Error("Data must be an array");
      }
  
      if (sortDirection) {
        let sortArray = data.sort((a, b) => a[sort] - b[sort]);
        return sortArray;
      } else {
        let sortArray = data.sort((a, b) => b[sort] - a[sort]);
        return sortArray;
      }
    };
  
  
    static toQueryString(params) {
  
      const queryString = [];
  
      if (params) {
        Object.keys(params).forEach((param) => {
          queryString.push(`${param}=${params[param]}`);
        });
      }
  
      return queryString;
    }

    static chunkArray(arr, chunkSize){
      const chunkedArr = [];
      for (let i = 0; i < arr.length; i += chunkSize) {
          chunkedArr.push(arr.slice(i, i + chunkSize));
      }
      return chunkedArr;
  };

  static isArray(arrayList){
    if(arrayList && Array.isArray(arrayList) && arrayList.length > 0){
      return true
    }
    return false
  }
  }
  
  export default ArrayList;
  