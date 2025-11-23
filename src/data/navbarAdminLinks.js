export const adminLinks = [
  { to: "/admin/dashboard", label: "Usuarios" },
  { to: "/admin/facciones", label: "Catalogo" },
  { to: "/pages/user/Home.jsx", label: "Salir", onClick: () => handleLogout() }, // opcional
];

export default adminLinks;