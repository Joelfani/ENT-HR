<template>
    <li>
      <a
        href="#"
        class="myBox"
        :class="{ 'dropdown-toggle': menu.subItems, selectedMenu: selected === menu.view }"
        :data-toggle="menu.subItems ? 'collapse' : null"
        :data-target="menu.subItems ? `#${menuId}` : null"
        :aria-expanded="menu.subItems ? 'false' : null"
        :title="menu.title"
        @click.prevent="handleClick(menu.action, menu.view)"
      >
        <div :class="`box centre ${menu.icon}`"></div>
        {{ menu.title }}
      </a>
      <ul
        v-if="menu.subItems"
        :id="menuId"
        class="collapse"
        data-parent="#menu"
      >
        <li v-for="subItem in menu.subItems" :key="subItem.title">
          <a
            v-if="subItem.condition || !subItem.condition"
            href="#"
            class="myBox"
            :class="{ selectedMenu: selected === subItem.view }"
            :data-toggle="subItem.modal ? 'modal' : null"
            :data-target="subItem.condition ? `#${subItem.modal}` : `#${subItem.modalOff || 'plus'}`"
            :title="subItem.title"
            @click.prevent="handleClick(subItem.action, subItem.view, subItem.modal)"
          >
            <div :class="`sub_box centre ${subItem.icon || menu.icon}`"></div>
            {{ subItem.title }}
          </a>
        </li>
      </ul>
    </li>
  </template>
  
  <script>
  export default {
    name: 'NavMenu',
    props: {
      menu: {
        type: Object,
        required: true,
      },
      selected: {
        type: String,
        default: '',
      },
    },
    computed: {
      menuId() {
        return `menu_${this.menu.title.toLowerCase().replace(/\s+/g, '_')}`;
      },
    },
    methods: {
      handleClick(action, view, modal) {
        // Emit select event for parent handling
        this.$emit('select', { action, view, modal });
  
        // Manually toggle collapse if needed (fallback)
        if (this.menu.subItems && !action && !modal) {
          const collapseEl = document.getElementById(this.menuId);
          if (collapseEl) {
            const isOpen = collapseEl.classList.contains('show');
            if (!isOpen) {
              collapseEl.classList.add('show');
            } else {
              collapseEl.classList.remove('show');
            }
          }
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .myBox {
    display: flex;
    align-items: center;
    padding: 10px;
    text-decoration: none;
    color: #333;
  }
  
  .myBox:hover {
    background-color: #f0f0f0;
  }
  
  .selectedMenu {
    background-color: #e0e0e0;
    font-weight: bold;
  }
  
  .box,
  .sub_box {
    margin-right: 10px;
  }
  
  .collapse {
    list-style: none;
    padding-left: 20px;
  }
  
  .collapse.show {
    display: block;
  }
  </style>