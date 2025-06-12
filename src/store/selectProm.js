import { defineStore } from 'pinia'

export const selectPromStore = defineStore('selectProm', {
state: () => ({
    promotion_selected:localStorage.getItem('promotion_selected') || '',
    promotionCan_selected: localStorage.getItem('promotionCan_selected') || ''
}),
actions: {
    setSelectProm(promotion) {
        this.promotion_selected = promotion
        localStorage.setItem('promotion_selected', promotion);
        
    },
    setSelectCanProm(promotion) {
        this.promotionCan_selected = promotion
        localStorage.setItem('promotionCan_selected', promotion);
    },
}
})
