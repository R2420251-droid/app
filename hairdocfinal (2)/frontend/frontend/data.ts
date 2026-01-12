export interface Service {
  id: number;
  category: 'Hair' | 'Nails' | 'Skin' | 'Makeup';
  name: string;
  description: string;
  duration: number;
  price: number;
  imageUrl: string;
  alt: string;
}

export const servicesData: Service[] = [
  {
    id: 1,
    category: 'Hair',
    name: 'Balayage',
    description: 'A French coloring technique for a natural, sun-kissed look.',
    duration: 90,
    price: 150,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqyn6De5OyocazKdNyRN6v36QR6n3Nerl3nurzlVms-GVUO443P5U2ny8h76xfBTD3bBjfxgfSv3p-7QXDvKmbWxjaY1ub1vzekwZRdzqW__0UWbh3914I835kkPUetriiXKs0lhXOS53IvkceFsUrOQDI0gdNQ4UhuSE3uc3rpJERtptMlc4qCB7zg-hkY0Klxq_5JGKVTQkBQZBnkVq7WhKqsfigqIBE03T8Npe1wmbMinWFMzzIjxSosAlHka6OpVuDAb0YaFyJ',
    alt: 'A woman with beautiful balayage hair.'
  },
  {
    id: 2,
    category: 'Nails',
    name: 'Gel Manicure',
    description: 'Long-lasting, chip-resistant polish for perfectly polished nails.',
    duration: 45,
    price: 50,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIEleki9RQjKCNa7l9uU74gLhropNK4-6Ih9dXwkaDNyMJSM3_-hTU3_jgM2pOV_YNlHIu--tP-W3TYzPAeMcH4Uc-Kx1VJgwxyv8ApweObpPeq3vit5TWbtoEGNmBySe3BU30zzil85ZZrgGdCkAnG7uN7cZqtIr9XPgPSP3yl7sw-qJfPxwteM6j6GCqrdbbtFZMZ-uV5SyQet7aqyIId6rk4Qjhk3lQQD6licDf1AbYSVJRVPvTbTMv5u5pe1xTDjygRAwSsbl2',
    alt: 'Close-up of perfectly manicured nails with gel polish.'
  },
  {
    id: 3,
    category: 'Skin',
    name: 'Hydrating Facial',
    description: 'Deep-cleansing and moisturizing for radiant, glowing skin.',
    duration: 60,
    price: 120,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCHa0B4JyM1VrQdNM09PN669iHu0xmjUbgk5jHp3_LYnMKzsmclx4SAeFhOWsAtR8GYXe98GM0GQD8WHhorh8CL0bsMuIL3NcANvCDMKMk72IGOjN8hOpIF0N5BxFvJRUcml0my7NwkMDP3zP6A4TRvjtzWubC4H0XUMXsiLOSVH1GxpGi0J7En4m8vqSEgBHj8J1D72xfCq-fCmuZ96HK3xhLkJsTA-cRrNkeHdnuc4V6_D_L_dhtNDK4jsRJyGXGKNHD6Io-vp0t',
    alt: 'A woman receiving a relaxing facial treatment.'
  },
   { 
    id: 4, 
    category: 'Hair', 
    name: "Women's Haircut", 
    description: "A customized haircut designed by your stylist to fit your individual style.",
    duration: 60, 
    price: 85, 
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsOuIgployG35NcM6G-8AG_qzCR_bYBL4vlNW6lKJib4eOYp8qLx65bX_q64G9IF-oyx2NAgfWs5vige3V9XPSJYR7FWBNhPIdk_Ry6VqHU-XEhdDc2K4nve-qF3V1g5eKzLaVZu0rYywsWdhYDdH5qc0C4SfALTT5Nj43rCE1C4iPkKoaASb14q71a8J-ATvFJVBlIIccQ2LQzOclOzR4scekisqiQfrgnu0gxSXk6qxpCyeFytAw3ocndGsdqO43brbLdJi1JkFL", 
    alt: "Stylized image of scissors cutting hair" 
  },
  { 
    id: 5, 
    category: 'Nails', 
    name: 'Classic Manicure',
    description: 'A classic manicure including shaping, cuticle care, and polish.',
    duration: 45, 
    price: 50, 
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOrr-xn9e-TJKmg_p79FSjARs772t6EOmpodCTelqM-6dr8_lTm9q_LcNoDNtm66TEX-QbRH9KpbhmCMM-DmOV6iRxh4NGrQTmZvdTdBjUvu4CBTRcsaFQyu6xk-5lEbp1gQIuTTKsWogHV587H17LBk2ONacz6e209pMExs9eq7Ccrnvf6qkDy5HiUpg3rXCN9OSyF13TeXHpreQWTy0c4FnSnPAYW6xbqmy_IuBvsSiUQ5IgJaiJV53z0eJZNS1GeLYNSHoPIK5i', 
    alt: 'Classic manicure' 
  },
];

export interface Course {
  id: number;
  category: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  prerequisites: string;
  imageUrl: string;
  alt: string;
}

export const coursesData: Course[] = [
  {
    id: 1,
    category: "Hair",
    title: "Advanced Hairdressing",
    description: "Master advanced cutting and coloring techniques with industry experts.",
    duration: "6 Weeks",
    price: 2500,
    prerequisites: "Beginner Level required",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCACRgGoDRzYxtdz9yYZiRNVMblOFrNZNQJllsBcZZskupOPexb2nUoumjzH3nZd755AFGSBRQOer052IvrDghkrgMl_zNEB8l1vI3a0x5u5L0TnM81t7YrXYIEv7MqznHRfEAX5ErH9Pus1oruXLatoiII5C058MgAOPO9W1wP4JgsajD2k2bOhHzqMazOzgO-WbDiYjMabBPq9G8CcOY0ftFjgkwwnzrkbseoiXxh0-nj8MF1eLdk8g6BdbZvI9eK1fjtXyjfnqka",
    alt: "Stylist cutting and coloring a client's hair in a modern salon"
  },
  {
    id: 2,
    category: "Makeup",
    title: "Advanced Makeup Artistry",
    description: "Perfect for aspiring professional makeup artists. Learn from the best.",
    duration: "4 Weeks",
    price: 1200,
    prerequisites: "No prerequisites",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfXk6uUsh_GuRgxSASIMmFVRsBoIfAyKfpX-gFpEJKjnlSrXRwItj5QcayArKxrFpdwMGr-0SOSELXGajBEIC7v2pnqPkFiUtPxnjMMruaHMONjoEZkNtqVdx8_LmxnNQCQmg53UUMStzYbwH4Hnp75UbLlc59fTwWmsjpFp1oKX9N08B_ZMOb9FJZrz4qiSFJn58pMFRteucoiCIi6rwIqkmkkrgNJRWiboGAXJmMyDrxHdrjmY8tJkemU5GdMdNB--s8V-5CP35l",
    alt: "A makeup artist applies intricate makeup on a model"
  },
  {
    id: 3,
    category: "Nails",
    title: "Master Nail Technician",
    description: "From basic manicures to advanced acrylics and gel art techniques.",
    duration: "8 Weeks",
    price: 1800,
    prerequisites: "No prerequisites",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5twrznf2DvFpqE3mSXrPK7Qlqj400ckD8E2jsKVTj_avulE5YoYZiCsmVCXGXg6CLo_QQ4HoTJL_VPCKFBiI5IbAyoczjMD4oxG8FL6M_FJGR_RoaNE0ra62A0KbDXZOawI5jkPzt_ykiRyqcSs8Mxb0FQ2pECW4azDUpJwAgcOWY557EUhyanjavUp5dVZ6KBfxfrh466pn6A01M6mWLBGaLEZ9J8k94dRyem2WH32CHPvhveiYcvszYYIe60DFng0MkKmK4Ct_1",
    alt: "A close-up shot of beautifully manicured nails with intricate art"
  }
];

export interface Product {
  id: number;
  category: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  alt: string;
}

export const productsData: Product[] = [
    { id: 1, category: "Hair Care", name: "Argan Oil Shampoo", description: "For silky, smooth hair", price: 28.00, stock: 50, imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlhbTRJZMsW563dKcoDK9F8htNvG16UtgQz5pC_rECoXLic740XLxMWnaSfaaUZyIflovtFOeTPOuZtYdfjL8gXQxFCl2CvhrX6cbs-fbeDVx0Ijj1o4YF1df3kDhRjkAI8sTRPhHy2yg85KswNxPsQbQwtVXasZrMxCKwy3SFD6ZDMV2JykBh-7OFh3VG6pISYD83k3MrsJ6HHDEbpNEdZls_7QBrMez9U4LY-pRTIkcW5zbX09TpPMTNER4XU9Q13HpM8IhPwchP", alt: "A bottle of Nourishing Argan Oil Shampoo on a clean background." },
    { id: 2, category: "Tools", name: "Pro-Grade Ionic Dryer", description: "Fast drying, less damage", price: 150.00, stock: 20, imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkQqrpmeOn7IdJoRxypsFQNBtpfwpNXYwxqeoD3OXj1435Py6QfNWuXkCWX7KvbUP14j6UlAD9Lh9F1oZ3iKmFW6uy1dn4bGAH09XurUohupPVasJvu4O-jYu3YgyMdYWKkteucc0gMDHbzCtN7g58FrMXJJFXumfM63gx_AsMoHp5ZG5D4u7JvBqaGBn1fWTi5NyteFGXc1_1Su2K2ZOL8dbO8660XN_kdncMOHAb9i9P9qj8omWjHmFq56utRG-Ft5M3DRgib6uo", alt: "A Pro-Grade Ionic hair dryer in a sleek design." },
    { id: 3, category: "Kits", name: "Essential Brush Kit", description: "Vegan and cruelty-free", price: 45.00, stock: 35, imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAT-Ro0HIGK5h9qJI-MLg4q9kuBJX_xlMieCy9T5A0GtF1x5mchfQXVHMcY8OKCp02Yze7CR1np1WVz4EeM7Kxmr-fnA4DYbVHc4WzuOAbHDNyrjiPSL3k39TnsNmzwpVGHGnomk3HIaVCzwSIThJGQ7LYUMYrNWx6_hz1IYGM_h70rBFeYGqnKT0DEXmbmWfIwzxWZFXzhxRCGlcef_oNcX8yzVcfgEyEsGxLRQ96lNv_bplz0Is2BfGejXMMG_s-BoxgfjTZIBJ6x", alt: "An essential makeup brush kit with vegan bristles." },
    { id: 4, category: "Skin Care", name: "Hydrating Face Serum", description: "For a radiant glow", price: 52.00, stock: 40, imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnTAtk7lLy6Tznx5SsGk3A9lda3uwt7H0_gz1VkgvAS6NGM-pCC4rZVDRaUAwvbVyN70wyjxF0Q_38kqhr5hScevB8Kr2ozXazgjslk2-jPRu2FWYV12g-b7SOzZ-W6-xe1UPdSkQzJ86xHTlkg8lYNHNisYv3vJ01EsQKI6osZ5ZznR6kGoLrm53P9LAF9SXt7ciWJ3bN4fY0exOm-t_lh7dLL6HO6aB9fNWkmeR62HocWRKWBMZ7z9fvsAorYpe518YMw0frcEOe", alt: "A bottle of Hydrating Face Serum against a minimalist backdrop." },
    { id: 5, category: "Tools", name: "Ceramic Flat Iron", description: "Sleek, frizz-free results", price: 89.00, stock: 25, imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDtp1uS7C4DwTOYlxTC-tbG029p0GEGTz0TIXh06vZ4w4Qev2_V5R6YM7YQi1w5ELoBsr3Sv5UWTxqCXn49YOkvDzZ7qiWUiQx6VJ7cFsISWuFoAGLS6lCq_Y53ot9nOQIES7XC-k_fAriflYEIY3L9ebkD33qXO_w50cU-pa8x7CehOizttr3-rYKLRzQiJBmEiHzYUE9psKb-DiR_6yrs0UFyVcMqWu87zQUlcxGfZI1Bil1zUYobJbSY_ZENUcLC5qduRtvdeQ5", alt: "A stylish flat iron for hair styling." },
    { id: 6, category: "Hair Care", name: "Volumizing Mousse", description: "Lightweight lift & hold", price: 24.00, stock: 60, imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYojsMaOH1UEV5hOfVNACB1n81gCXlqmGmzgt2f4NoHPnVtBFXXfS4aqds-75bo-zuzqz9bjjUUF8aQ2tLi0w1BS5n-FpRKU2EYsVMxXVLbkGtl3_4fDRucYOG0Pq-Yu38o4ZW6X_p40mUuExcOGG1arSUyVK33UIfZsvsVHzf43c1pie_baISsOBVAeS6gNJoJMZHRp8pteZVTDRK7iO6CaFn7Hac2E4IrULvLc5ATAu8fKHYodaoEyBZ36fGJREh-jh0zXS8soHt", alt: "A volumizing hair mousse product." }
];

export interface Review {
    name: string;
    time: string;
    service: string;
    rating: number;
    review: string;
    likes: number;
    dislikes: number;
    avatarUrl: string;
}

export const salonReviewsData: Review[] = [
  {
    name: 'Jessica L.',
    time: '2 weeks ago',
    service: 'Manicure',
    rating: 5,
    review: 'Hair Doc is my go-to salon! The atmosphere is so relaxing, and my nails have never looked better. The attention to detail is just incredible.',
    likes: 12,
    dislikes: 0,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmWMRrlSG6DnHaS2o2ffRdNCrmq6yjKsgtWj00MWRQU6_MesMmkR2tKDNdsRC7xYrH8LUHTk7oHDaq13yPFiSpaU_tBCKybqSQGlWW-RtpjnvwUSQqWfk1bs6_ts4zL27xdJdzwWeFCqurqF7Su_eOry_EeRS3O7HgyuIk8CP3NN8ecjx2mjZ_yBa1EYaJLl5DTK7E5dOSYXs4Qft8WL2_bLjIQ443YWXGTXjblTdAuRfZapRkWnEmL4PkNs7AXOkX1cagXYpS5o0k',
  },
  {
    name: 'Maria G.',
    time: '1 month ago',
    service: 'Facial',
    rating: 5,
    review: 'I had the most amazing facial. The staff was so professional and made me feel completely pampered. My skin is glowing! Highly recommend this place.',
    likes: 8,
    dislikes: 1,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2_bdU4efvA3iRxZlPE5YZ4YKsQct02bccg-eHNR6ZtZK2w7q3ZqMmSWcupnx9dur8s78EQjf2JrF79VJDtylDHStgTxugbmAZJR8vUXTe3UHHNXP5LkJd7nzu_KJE4ieLI1ujq83CGXl4LyVQ83Uv0Wx8j4U5Je72PvCp0rMP2biCzjJhkoRXVEHRqBPJJQt6LAnlAq7UCOj-ABgPs1yQR_D6HtCmHBnOqY9LuHQvtESLoWdbyDMTRG1-S_psFLAUEZ8m6nvAn-fV',
  },
  {
    name: 'Sophie R.',
    time: '3 months ago',
    service: 'Haircut',
    rating: 4,
    review: 'A wonderful experience from start to finish. The salon is beautiful, and the stylists are true artists. I\'m so happy with my new haircut.',
    likes: 5,
    dislikes: 0,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNmTwF_J1KAGm8SqT1o_S5Nb_cMIDeuO7-RSSLMG-8o_fJObG-G8M-ZqvwD0GPU1qxO1GvSdr8g4LCs-8vuFolyuDZJlsM84549wkRTxgNgiYdDwFyPTtLOYmYLS7ss9mSbo4VKtL1QMI0j9vLjhp9un0rzEvg2UaOEpjqME28iX86CnLJ3-O8lvOBj8QED0Gaju_M-Rm1YbFHrSHGgNaZQNMYM0DdPlVckmNj4_zDqr8CCSBT_4jidrG63gZTxTWJLsa2lb9hpC9-',
  },
];

export const academyReviewsData: Review[] = [
    {
        name: 'Jessica Miller',
        time: '6 months ago',
        service: 'Lash Course',
        rating: 5,
        review: 'Hair Doc transformed my confidence. The lash course was incredibly detailed, and the instructors were so supportive. I started my own business right after!',
        likes: 25,
        dislikes: 0,
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqb1c9lOSSDK9A0Zq2G4O7N2cm6q43MSGsX_Uz79sMATpr6OP2uWuu4l9GsVl69drvrp8-Z_i9CIU2-1ZEYkJstZ7qGysgEDHf91PUqhokXHkikeUJjGP7_rW7E-grlxznn9S_dyu0W70mMYl7kHezpQ0TYga-0SQse2INFKtXkQd4PyC16YTtlzuzMzijll56Bv4KWt-hrjU4iRQwVawI2_2YakI_erTA6CHFG6fYfi5QFU7h4cCHuaOzAxiNLb7ybm2w3RHJce5i',
    },
];

export interface Expert {
  name: string;
  role: string;
  imageUrl: string;
}

export const expertsData: Expert[] = [
  { name: 'Olivia Chen', role: 'Senior Stylist', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4J4daq5p1L0Ql5LCy-G82OYC-RUCmks3LGT1yztX2h9XeG0J8rhw6O5TemSdq05tOzwC38-Z3CyhZE4ATlV4F4EapCQIzSIdDfsDhQ_dBV8PWH3WUqfHcPNHg9lfAjTIa8_pUIAmmQSbNJ619dmGTMiRBa01zDt0lXTyyCvmSg4pUK-VQF8sOwtR6-5HhWAcVvjxvIDFbfaHaS8auk-drKdhGfCTk3ca2C40i5_4zSRAnIVZHrK9yPD5xEtNnTNi5rVYDBvrl57qr' },
  { name: 'Ben Carter', role: 'Lead Educator', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBj0488QyY2_eDPFTZOp4Ym0CIVzQrkSMOJzkPBNNre8CzrjxkO8MhiHMh4SmKHVLsJDlCUKFGEdqQ5A0TX3YMT6mCLpTzllXbX0tItc73AI-iYa9vPxYaKeCgOgo8kJHGEJNpBei8-8Trmo7lOdQcqGjl7FWheIH9ma-ym-FSxQQHQTIAhVluUOin1S9mCYWGvg_rbeCu0LEcgIJAXpTB5T-8_kMmz-a9TX9GAqWtVNcNpSG4SDMFSG3Q9XbE9XmMwGwrM4IAmPkr' },
  { name: 'Sophia Rodriguez', role: 'Master Colorist', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLO24wYatJEZClvQQ25fmxfpQtbpqgydWxLe-XstmgWsm77LuZPqLyDEUK1VzDBfpbPVOgIn3UL24PgfnhkQGqc8dx9ZXRdS-7bAbtmtp6pKw1nvHFM08pA6KdMRjXYPORXOo2J_3elJP62tCOIumwocO2E_yWZoa9UNtHGDMz2vVFP2QJq-ZK4tPZ9g8rK-LaFjmHNoSOQR1LBLw1Rwx1D50uwNMmeXaelSCS3DScpWioF7BdEkKMriSrp1D9dUc_SDIrnbC5L_4r' },
  { name: 'Liam Goldberg', role: 'Nail Artist', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGO4DQrw-QV5V8nc37vrml0Cld7Y--w9XY6UqfxInauBcWUpvli1lk7IHk5yAjSeZdCb1ei6uhw--qmUt94IKGWAkLK4HcfX8zEDFDTWkCihcuKGly-eMi6uyKeob3MTyIZSkcehIMB8m9PsVsiDr_cpB2Mg_MB2aa1_cRhdh_kJwQNlx8RjfB-JUrMB_OkaLvfd8F_t795fARYpxCJVvTBv-eEIcdqDRBrwNoeAMuVSAA1gXy5Xs5rTQHV-C0jWFnAtM443D90Y9J' },
];

export interface CommunityReview {
    name: string;
    role: string;
    quote: string;
    imageUrl: string;
}

export const communityData: CommunityReview[] = [
    { name: 'Jessica Miller', role: 'Loyal Client', quote: "The best salon experience I've ever had. The attention to detail is unmatched, and I always leave feeling like a new person!", imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUDijai_ofUQC5512Fpq4QFv-FCY6e8HwzTj3TTHNRoCwcMyo6uJEfaUJ-IFPqzd0lZI56Osf4-uhIiHYaYMMGd7dLPO3Pli1F_bZjUVWr8AYKLuC2KgrVnEsC8rdHzt1fBrWjiq1W7jpCeXn5z_af-KcuPLF6Cev7usHnm3VDugAxxV1M2gDHORHfvHFsVm48Qa0UP8zpf7-aJ3cu42NL-QsqjeQYXAnvoIXe2zw1d-AjlZTR2ri0fv45jGs4xR3wZrfeYX1CsxkN' },
    { name: 'David Kim', role: 'Academy Graduate', quote: "The academy gave me the skills and confidence to start my own business. The instructors are true masters of their craft.", imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3hhRHZMnNH96xiWtx6kLSpsa2ocBuWJsP991-SyuGgHtpzWdIEUQS-_bH_5PFC5YS8qFaFYo9PcJ-3CuTmRXnFYBRGoKT6a9vXxOJFmSOxKzi5Mj4MJO6mqHhd3c66HYo6Vy6wl4E1rfToTtb-VXCXrvmIbrlUVRc5vURBPzba0ewlconjksnFlPDeT6P-7mRh6xDodyIH5nfnbtRv_iDdKwLdjrMZb3WICyFeZTRsb5CTJlwPsIiMfdHmS8iC_UEwU47Eo9lNtwz' },
];

export interface Staff {
  id: number;
  name: string;
  specialty: string;
  avatarUrl: string;
}

export const staffData: Staff[] = [
  { id: 1, name: 'Chloe', specialty: 'Nail Art Specialist', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4J4daq5p1L0Ql5LCy-G82OYC-RUCmks3LGT1yztX2h9XeG0J8rhw6O5TemSdq05tOzwC38-Z3CyhZE4ATlV4F4EapCQIzSIdDfsDhQ_dBV8PWH3WUqfHcPNHg9lfAjTIa8_pUIAmmQSbNJ619dmGTMiRBa01zDt0lXTyyCvmSg4pUK-VQF8sOwtR6-5HhWAcVvjxvIDFbfaHaS8auk-drKdhGfCTk3ca2C40i5_4zSRAnIVZHrK9yPD5xEtNnTNi5rVYDBvrl57qr' },
  { id: 2, name: 'Alex', specialty: 'Makeup Artist', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBj0488QyY2_eDPFTZOp4Ym0CIVzQrkSMOJzkPBNNre8CzrjxkO8MhiHMh4SmKHVLsJDlCUKFGEdqQ5A0TX3YMT6mCLpTzllXbX0tItc73AI-iYa9vPxYaKeCgOgo8kJHGEJNpBei8-8Trmo7lOdQcqGjl7FWheIH9ma-ym-FSxQQHQTIAhVluUOin1S9mCYWGvg_rbeCu0LEcgIJAXpTB5T-8_kMmz-a9TX9GAqWtVNcNpSG4SDMFSG3Q9XbE9XmMwGwrM4IAmPkr' },
  { id: 3, name: 'Sarah', specialty: 'Lead Hair Stylist', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLO24wYatJEZClvQQ25fmxfpQtbpqgydWxLe-XstmgWsm77LuZPqLyDEUK1VzDBfpbPVOgIn3UL24PgfnhkQGqc8dx9ZXRdS-7bAbtmtp6pKw1nvHFM08pA6KdMRjXYPORXOo2J_3elJP62tCOIumwocO2E_yWZoa9UNtHGDMz2vVFP2QJq-ZK4tPZ9g8rK-LaFjmHNoSOQR1LBLw1Rwx1D50uwNMmeXaelSCS3DScpWioF7BdEkKMriSrp1D9dUc_SDIrnbC5L_4r' },
];

export type BookingStatus = 'Pending' | 'Confirmed' | 'Canceled';

export interface Booking {
  id: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  service: string;
  staff: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "10:30 AM"
  status: BookingStatus;
  price: number;
  duration: number;
}

export const bookingsData: Booking[] = [
  { id: 1, clientName: 'Jessica Williams', clientEmail: 'jess.w@example.com', clientPhone: '555-1234', service: 'Gel Manicure', staff: 'Chloe', date: '2023-11-20', time: '10:30 AM', status: 'Pending', price: 50, duration: 45 },
  { id: 2, clientName: 'Olivia Martinez', clientEmail: 'olivia.m@example.com', clientPhone: '555-5678', service: 'Balayage', staff: 'Alex', date: '2023-11-21', time: '12:00 PM', status: 'Confirmed', price: 150, duration: 90 },
  { id: 3, clientName: 'Michael Chen', clientEmail: 'mike.c@example.com', clientPhone: '555-9012', service: "Women's Haircut", staff: 'Sarah', date: '2023-11-22', time: '2:30 PM', status: 'Canceled', price: 85, duration: 60 },
];

export type EnrollmentStatus = 'Pending' | 'Approved' | 'Declined';

export interface Enrollment {
    id: number;
    name: string;
    email: string;
    phone: string;
    course: string;
    submitted: string;
    status: EnrollmentStatus;
    avatarUrl: string;
    alt: string;
}

export const enrollmentsData: Enrollment[] = [
    { id: 1, name: 'Jessica Miller', email: 'jessica.m@example.com', phone: '555-0101', course: 'Advanced Makeup Artistry', submitted: 'Oct 26, 2023', status: 'Approved', avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmAmOIOWVBJnmV7snUjDCiG4MD7hSoZ5YR9CVYRiNi2QFORaZa3LKmFF7lpZtGu97l5YWqIleS-qBW6VR3Op1Y8cr5bpesy3L-B4OCH95noFyZWdZV7znt8Dp2reKul06kRvpHIq8gwXpBaHEort8T8UxrLPgBte-NCj-MWRYnuB1jHZyAppvVVXZLZBhoDmlaOgknCTJnGlPa7kmO9Zv_8_k-edZw4dUQt5dCrwEeXK-S0rKeTMeIOVWdiMlVgdX7KOMigHuzfrqW", alt: "Profile picture of Jessica Miller" },
    { id: 2, name: 'Benjamin Carter', email: 'benjamin.c@example.com', phone: '555-0102', course: 'Classic Lash Extensions', submitted: 'Oct 25, 2023', status: 'Pending', avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1eQiaBa-skAkanENvl8ZFD_XXOIjpkVXksVvt9xDsId7gF6_qIpREE05i0Q57isxRjNAtWEKuhLn-TH8V0pHDJRtbBIp6f05jzqo9CL4tEAX4WnZMc0Lw3itAl85cHc_ZVv5eXb180y0ZuADi0CAMkXKkLJ5AXUKzo-PuyVVeGvuyoLaa8yyTAVw9c7a4jsTY7OjAFX7b35bpdxteaq_oLQVZS0hocrReUvfe_ZdHG0wBCWQeC06ne-KMPHAma4jam9e_Z2N-ccV-", alt: "Profile picture of Benjamin Carter" },
    { id: 3, name: 'Olivia Chen', email: 'olivia.c@example.com', phone: '555-0103', course: 'Professional Nail Technician', submitted: 'Oct 24, 2023', status: 'Declined', avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdr4DPhv3FAy4-cQ8R6dvTeGBoVCdzJTLiWr7RfIfMIPKlRkIUgVmzWFc7vvAp-bEUuFXTYJZtpq1QXbr1FhdbnawRfl7KS37nGYlsgEldOk3GJqOV7HXgAGFI1WmSnKeqJtje4gDsuDOJEDM1RfY-J-ZWfRup5q2gppXDhjI22lSmgwRS28GmBnUcem97OichsQTCvL0pAiRborqsWTKjqWb4vZl6KLQIntJu3PhOWEQlI2BSVPAdFy3tnzznUtpUMlb-g5rRk-je", alt: "Profile picture of Olivia Chen" },
    { id: 4, name: 'David Rodriguez', email: 'david.r@example.com', phone: '555-0104', course: 'Advanced Skincare', submitted: 'Oct 23, 2023', status: 'Approved', avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5M9wg0FZJMfgowtmwhZeV1JlboNg8C5l8jmeX_E11mEz_ITLLz_IH_XNpb-UEui_W9Od-qbdk9EEBaMTsZiq7Wl8yuZGIwhWfqQc-BlN2MJwJ6-SNbz3_0SU5-Y2JAeJzOOBcZwP5k-UdzZz5dzi0s-Sdq6PhSiIHngqEgBIiZCilM2ehjYYkn0ByOAQ1QQdi5gMO6c9J1h7bp0OfoevI1DmfVKvIOQp86oSfLXWUMYGIR04NGSWie_1lazECJRRILPe6O12Ud6cO", alt: "Profile picture of David Rodriguez" },
];

export interface GalleryItem {
  id: number;
  category: string;
  caption: string;
  imageUrl: string;
  alt: string;
}

export const galleryData: GalleryItem[] = [];

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Canceled';

export interface Order {
    id: string;
    clientName: string;
    date: string;
    status: OrderStatus;
    total: number;
}

export const ordersData: Order[] = [
    { id: '#G&G-0879', clientName: 'Jessica Miller', date: 'Oct 26, 2023', status: 'Shipped', total: 73.00 },
    { id: '#G&G-0878', clientName: 'Benjamin Carter', date: 'Oct 25, 2023', status: 'Pending', total: 150.00 },
    { id: '#G&G-0877', clientName: 'Olivia Chen', date: 'Oct 24, 2023', status: 'Delivered', total: 45.00 },
    { id: '#G&G-0876', clientName: 'David Rodriguez', date: 'Oct 23, 2023', status: 'Canceled', total: 22.00 },
];

export interface SocialLinks {
  instagram: string;
  twitter: string;
  facebook: string;
}

export interface AdminUser {
  id: number;
  name: string;
  role: 'Super Admin' | 'Admin';
  avatarUrl: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string; // In a real app, this would be a hash.
  name: string;
  role: 'Super Admin' | 'Admin' | 'Client';
  avatarUrl: string;
}

export const usersData: User[] = [
    {
        id: 1,
        username: "mashizhasharon",
        email: "Mashizhasharon@gmail.com",
        password: '.s+>A?mytjN]!8"',
        name: "Hair Doc",
        role: "Super Admin",
        avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfpKzXJiE_NoAgO7eNS_yFf1UBnr4opBnDElN2c-t-TtWNcT_MYlxlwTCSj0r3u3MJyc9AOwRMof3rdgXh-IYBbg2H1fkhAtPBMqnyRoAtHscHc57v6LEqzb8ntU-IQvAcaqyZvaByB9eyc2SPYQedAjAVGTjhwTjv4ea5dZxgX2hqZnpaOh8NIHFBFNqptbSDr4ktUvDfILYik5IUMyelrnXdjkfgF342dDrpATAENElZAlfLDx02TBnd7fcLucROZ8c6slmcqbPw"
    },
    {
        id: 2,
        username: "client1",
        email: "client1@example.com",
        password: "password",
        name: "Jessica Miller",
        role: "Client",
        avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqb1c9lOSSDK9A0Zq2G4O7N2cm6q43MSGsX_Uz79sMATpr6OP2uWuu4l9GsVl69drvrp8-Z_i9CIU2-1ZEYkJstZ7qGysgEDHf91PUqhokXHkikeUJjGP7_rW7E-grlxznn9S_dyu0W70mMYl7kHezpQ0TYga-0SQse2INFKtXkQd4PyC16YTtlzuzMzijll56Bv4KWt-hrjU4iRQwVawI2_2YakI_erTA6CHFG6fYfi5QFU7h4cCHuaOzAxiNLb7ybm2w3RHJce5i"
    }
];


export interface Settings {
  salonName: string;
  logoUrl: string;
  faviconUrl: string;
  maintenanceMode: boolean;
  primaryPhone: string;
  bookingEmail: string;
  address: string;
  socials: SocialLinks;
  apiUrl?: string;
}

export const settingsData: Settings = {
  salonName: "Hair Doc Salon & Academy",
  logoUrl: "", // We can start with empty or a placeholder
  faviconUrl: "",
  maintenanceMode: false,
  primaryPhone: "+27 670343809",
  bookingEmail: "Mashizhasharon@gmail.com",
  address: "Pretoria, South Africa",
  socials: {
    instagram: "https://instagram.com/hairdoc",
    twitter: "https://twitter.com/hairdoc",
    facebook: "https://facebook.com/hairdoc",
  },
  apiUrl: "",
};

export type CartItem = {
  productId: number;
  quantity: number;
};