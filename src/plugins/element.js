/*
 * @Author: xujintai
 * @Date: 2020-11-05 08:24:14
 * @LastEditors: xujintai
 * @LastEditTime: 2020-11-09 15:03:50
 * @Description: 文件说明
 */
import Vue from 'vue'
import {
    Message,
    Button,
    Form,
    FormItem,
    Input,
    Main,
    Aside,
    Container,
    Header,
    Menu,
    Submenu,
    MenuItem,
    BreadcrumbItem,
    Breadcrumb,
    Card,
    Row,
    Col,
    TableColumn,
    Table,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Select,
    Option,
    Cascader,
    Alert,
    Tabs,
    TabPane
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Container)
Vue.use(Header)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(TableColumn)
Vue.use(Table)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)


Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm