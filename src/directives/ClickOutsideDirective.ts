import type { App, Directive, DirectiveBinding } from 'vue';

const clickOutsideDirective: Directive = {
  mounted(el: HTMLElement | any, binding: DirectiveBinding) {
    function childOf(c:HTMLElement, p:HTMLElement){
        while((c=(c.parentNode as HTMLElement))&&c!==p); 
        return !c; 
    }
    const onClickOutside = (event: MouseEvent) => {
      if (!childOf(el, (event.target as HTMLElement))) {
        binding.value();
      }
    };
    document.addEventListener('click', onClickOutside);
    el.__clickOutside__ = onClickOutside;
  },
  unmounted(el: HTMLElement | any) {
    document.removeEventListener('click', el.__clickOutside__);
    delete el.__clickOutside__;
  },
};

export const installClickOutsideDirective = (app: App): void => {
  app.directive('click-outside', clickOutsideDirective);
};