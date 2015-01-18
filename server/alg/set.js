function Set() {          // This is the constructor
    this.values = [];     // The properties of this object hold the set
    this.length = 0;           // How many values are in the set
}

// Add each of the arguments to the set.
Set.prototype.add = function (argument) {
    for (var i = 0; i < this.length; i++) {  // For each argument
        if (argument == this.values[i]) {
            return i;
        }
    }
    this.values.push(argument);
    this.length++;
    return this.length - 1;                                 // Support chained method calls
};

module.exports = Set;