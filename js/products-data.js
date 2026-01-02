// Base catalog for Velvet Vogue
const baseProducts = [
  {
    id: 'vv001',
    name: 'Velvet Noir Blazer',
    category: 'Formal',
    price: 3200,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#1c1c1c', '#3a3a3a'],
    description: 'Tailored velvet blazer with peak lapels and a soft satin lining for evening statements.',
    tags: ['new', 'limited', 'formal'],
    image: 'assets/Pics%20Of%20velvelt/Formal%20Wear/Men/1.jpg',
  },
  {
    id: 'vv002',
    name: 'Satin Midnight Gown',
    category: 'Formal',
    price: 4100,
    sizes: ['S', 'M', 'L'],
    colors: ['#111111', '#2b2b2b'],
    description: 'Floor-length satin gown with sculpted bodice, subtle shimmer, and side slit.',
    tags: ['evening', 'luxury'],
    image: 'assets/Pics%20Of%20velvelt/Formal%20Wear/Female/6.jpg',
  },
  {
    id: 'vv003',
    name: 'Urban Luxe Bomber',
    category: 'Casual',
    price: 1900,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['#0f0f0f', '#d4af37'],
    description: 'Matte bomber with quilted lining, gold zip hardware, and ribbed trims.',
    tags: ['street', 'casual'],
    image: 'assets/Pics%20Of%20velvelt/Casual%20Wear/Men/1.jpg',
  },
  {
    id: 'vv004',
    name: 'Signature Monogram Tee',
    category: 'Casual',
    price: 8500,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['#1b1b1b', '#f5f5f5'],
    description: 'Soft cotton tee with minimal Velvet Vogue monogram and relaxed fit.',
    tags: ['best seller'],
    image: 'assets/Pics%20Of%20velvelt/Casual%20Wear/Female/1.jpg',
  },
  {
    id: 'vv005',
    name: 'Sculpted Tailored Trousers',
    category: 'Formal',
    price: 2100,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#111111', '#4a4a4a'],
    description: 'Tapered trousers with pressed creases, hidden closure, and stretch comfort.',
    tags: ['tailored'],
    image: 'assets/Pics%20Of%20velvelt/Formal%20Wear/Men/1.jpg',
  },
  {
    id: 'vv006',
    name: 'Cashmere Blend Hoodie',
    category: 'Casual',
    price: 1750,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#0c0c0c', '#bdbdbd'],
    description: 'Featherlight hoodie in cashmere blend with tonal drawcords and kangaroo pocket.',
    tags: ['loungewear'],
    image: 'assets/Pics%20Of%20velvelt/Casual%20Wear/Female/2.jpg',
  },
  {
    id: 'vv007',
    name: 'Minimalist Leather Belt',
    category: 'Accessories',
    price: 1200,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#0b0b0b', '#d4af37'],
    description: 'Full-grain leather belt with brushed gold buckle and edge painting.',
    tags: ['accessory'],
    image: 'assets/Acecesories.jpg',
  },
  {
    id: 'vv008',
    name: 'Aurum Statement Earrings',
    category: 'Accessories',
    price: 1400,
    sizes: ['One Size'],
    colors: ['#d4af37'],
    description: 'Sculptural gold-tone earrings with mirror polish and hypoallergenic posts.',
    tags: ['jewelry'],
    image: 'assets/Acecesories.jpg',
  },
  {
    id: 'vv009',
    name: 'Velour Track Set',
    category: 'Casual',
    price: 2200,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#161616', '#343434'],
    description: 'Matching velour jacket and pants with piping detail and relaxed silhouette.',
    tags: ['set', 'new'],
    image: 'assets/Pics%20Of%20velvelt/Casual%20Wear/Men/2.jpg',
  },
  {
    id: 'vv010',
    name: 'Double-Breasted Overcoat',
    category: 'Formal',
    price: 3600,
    sizes: ['M', 'L', 'XL'],
    colors: ['#0a0a0a'],
    description: 'Longline wool-cashmere coat with peak lapels and silk pocketing.',
    tags: ['outerwear'],
    image: 'assets/Pics%20Of%20velvelt/Formal%20Wear/Female/2.jpg',
  },
  {
    id: 'vv011',
    name: 'Quilted Weekender Bag',
    category: 'Accessories',
    price: 2600,
    sizes: ['One Size'],
    colors: ['#0d0d0d'],
    description: 'Spacious weekender with quilted body, gold zips, and detachable strap.',
    tags: ['travel'],
    image: 'assets/Acecesories.jpg',
  },
  {
    id: 'vv012',
    name: 'Silk Neck Scarf',
    category: 'Accessories',
    price: 9500,
    sizes: ['One Size'],
    colors: ['#d4af37', '#ffffff'],
    description: 'Pure silk scarf with hand-rolled edges and subtle monogram print.',
    tags: ['silk', 'accessory'],
    image: 'assets/Acecesories.jpg',
  },
];

function getStoredAdminProducts() {
  const raw = localStorage.getItem('vv_admin_products');
  try {
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Resetting admin product store', e);
    localStorage.removeItem('vv_admin_products');
    return [];
  }
}

function saveAdminProducts(items) {
  localStorage.setItem('vv_admin_products', JSON.stringify(items));
}

function getAllProducts() {
  const adminProducts = getStoredAdminProducts();
  const merged = [...baseProducts];
  adminProducts.forEach((item) => {
    const exists = merged.find((p) => p.id === item.id);
    if (exists) {
      Object.assign(exists, item);
    } else {
      merged.push(item);
    }
  });
  return merged;
}

function getProductById(id) {
  return getAllProducts().find((p) => p.id === id);
}

function addAdminProduct(product) {
  const items = getStoredAdminProducts();
  items.push(product);
  saveAdminProducts(items);
}
