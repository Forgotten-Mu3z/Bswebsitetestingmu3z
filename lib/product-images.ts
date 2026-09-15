const catalogImageSlugs = new Set([
  'acegeek-clearion-atx-case-black',
  'amd-ryzen-7-7800x3d',
  'amd-ryzen-7-9700x-tray',
  'asrock-rx-9070-xt-steel-legend-16gb',
  'asus-b850-max-gaming-wifi',
  'asus-prime-lc-360-argb-lcd-black',
  'asus-prime-radeon-rx-9070-evo-oc-16gb',
  'asus-prime-z890-p-csm',
  'asus-proart-rtx-5080-oc-16gb',
  'asus-t1-rtx-5070-oc-12gb',
  'asus-tuf-gaming-x870e-plus-wifi7',
  'corsair-frame-4000d-rs-white',
  'corsair-rm1000e-1000w-gold',
  'corsair-rm750e-750w-atx',
  'corsair-rs140-argb-dual-pack-white',
  'corsair-vengeance-rgb-32gb-ddr5-6000',
  'corsair-vengeance-rgb-64gb-ddr5-6000',
  'deepcool-le240-v2-argb-black',
  'elgato-video-capture-usb',
  'gigabyte-b850m-ds3h',
  'intel-core-i5-12400f',
  'intel-core-i5-13600k',
  'intel-core-i7-14700f-tray',
  'intel-core-i9-14900k',
  'intel-core-ultra-5-250kf-plus',
  'intel-core-ultra-7-265k-tray',
  'lexar-nq780-1tb-gen4-nvme',
  'lian-li-o11-vision-m-digital-black',
  'lian-li-uni-sl-infinity-120mm-triple-white',
  'msi-pro-b850m-a-wifi',
  'msi-pro-b850m-p',
  'msi-rtx-5060-ti-ventus-3x-oc-8gb',
  'msi-rtx-5060-ventus-2x-oc-8gb',
  'msi-rtx-5090-ventus-3x-oc-32gb',
  'msi-spatium-m560-1tb-pcie5-nvme',
  'noctua-nt-h2-thermal-paste-3-5g',
  'nvidia-geforce-rtx-5090-32gb',
  'nzxt-c750-gold-core-atx31',
  'pny-performance-16gb-ddr4-3200',
  'samsung-990-pro-2tb-nvme',
  'thermaltake-pcie4-riser-cable-130mm',
  'thermaltake-toughpower-gf3-850w',
  'toshiba-p300-4tb-desktop-hdd',
  'tp-link-archer-t9e-ac1900-pcie-wifi',
  'western-digital-red-plus-8tb-nas-hdd',
  'xpg-lancer-blade-rgb-16gb-ddr5-6000-white',
  'zotac-rtx-5080-solid-core-16gb',
]);

export const missingProductImage = '/product-photo-needed.svg';

export function resolveProductImage(slug: string, imageKey: string | null) {
  if (imageKey && imageKey !== '/blackshark-logo.png') return imageKey;
  return catalogImageSlugs.has(slug)
    ? `/products/${slug}.webp`
    : missingProductImage;
}
