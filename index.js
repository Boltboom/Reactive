class Actor {
    
    constructor() {
        this.stats={};
    }

    mod(stat,amt) {
        this.stats[stat] += amt;
    }

    set(stat,val) {
        this.stats[stat] = val;
    }
    
}

