export const money=(value:number)=>`$${value.toLocaleString('en-US',{maximumFractionDigits:6})}`;
export const decimal=(value:number)=>value.toLocaleString('en-US',{maximumFractionDigits:6});
