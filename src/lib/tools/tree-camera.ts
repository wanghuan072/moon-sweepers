export interface TreeCamera {x:number;y:number;scale:number}
interface FocusArea {
  width:number;height:number;panelLeft:number;panelTop:number;stacked:boolean;
}

// Keep the selected node inside the part of the canvas not occupied by details.
export function focusTreeNode(position:readonly [number,number],camera:TreeCamera,area:FocusArea):TreeCamera {
  const width=area.stacked?area.width:Math.min(area.width,Math.max(80,area.panelLeft-20));
  const height=area.stacked?Math.min(area.height,Math.max(80,area.panelTop-20)):area.height;
  const scale=Math.min(Math.max(camera.scale,.95),(width-24)/200,(height-16)/100);
  return {scale,x:width/2-position[0]*scale,y:height/2-position[1]*scale};
}
