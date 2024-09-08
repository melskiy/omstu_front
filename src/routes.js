import Index from "views/Index.js";

var routes = [
  {
    path: "/index",
    name: "Дашборд",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
];
export default routes;
