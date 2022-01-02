/// <reference types="react-scripts" />

declare module '*.scss' {
    const content: any;
    export default content;
}

declare global {
    interface Window { __GLOBAL_VAR__: any; }
}
