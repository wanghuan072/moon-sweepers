export interface Requirement {id:string;level:number}
export interface UpgradeNode {
 id:string;title:string;branch:string;kind:string;costs:number[];effects:string[];
 requires:Requirement[];requiresAny?:Requirement[];source:string;tool?:string;
}
export interface PlanItem {id:string;owned:number;target:number}
export interface Purchase {id:string;title:string;level:number;effect:string;basePrice:number;price:number;discount:number;neededFor?:string}
