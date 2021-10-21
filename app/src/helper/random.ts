export function randomRange(start:number, stop:number) : number{
    return Math.floor(Math.random() * ((stop +1) - start)) + start;
}
