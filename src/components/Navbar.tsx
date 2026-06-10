import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, Menu, X, DollarSign, Trash2, ShieldCheck, Check } from "lucide-react";
import { CartItem } from "../types";

interface NavbarProps {
  cart: CartItem[];
  onUpdateCartQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  currencyMode: "ARS" | "USD";
  setCurrencyMode: (mode: "ARS" | "USD") => void;
  usdRate: number;
  setUsdRate: (rate: number) => void;
}

export default function Navbar({
  cart,
  onUpdateCartQuantity,
  onRemoveFromCart,
  onClearCart,
  currencyMode,
  setCurrencyMode,
  usdRate,
  setUsdRate
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [exchangeInput, setExchangeInput] = useState(usdRate.toString());

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalArs = cart.reduce((acc, item) => acc + item.product.priceArs * item.quantity, 0);
  const cartTotalUsd = cartTotalArs / usdRate;

  const handleUpdateExchange = (val: string) => {
    setExchangeInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setUsdRate(num);
    }
  };

  const navLinks = [
    { name: "Tienda", href: "#tienda" },
    { name: "Servicios", href: "#servicios" },
    { name: "Casos Reales", href: "#casos" },
    { name: "Diagnóstico", href: "#diagnostico" },
    { name: "Contacto", href: "#contacto" }
  ];

  const handleCheckout = () => {
    setIsCheckoutSuccess(true);
    setTimeout(() => {
      setIsCheckoutSuccess(false);
      onClearCart();
      setIsCartOpen(false);
    }, 4500);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)] text-white px-4 py-3 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <span className="text-xl md:text-2xl font-bold font-sans tracking-wider text-emerald-400 font-mono group-hover:text-emerald-300 transition-colors">
              LyC<span className="text-white">.</span>Tech
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-300 hover:text-emerald-400 transition-all font-sans duration-200 hover:scale-105"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Actions Menu */}
          <div className="flex items-center gap-4">
            {/* Currency Switcher */}
            <div className="flex items-center bg-gray-900 border border-emerald-500/40 rounded-lg p-1 text-xs">
              <button
                onClick={() => setCurrencyMode("ARS")}
                className={`px-2.5 py-1 rounded font-mono transition-all ${
                  currencyMode === "ARS"
                    ? "bg-emerald-500 text-black font-bold shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                ARS
              </button>
              <button
                onClick={() => setCurrencyMode("USD")}
                className={`px-2.5 py-1 rounded font-mono transition-all ${
                  currencyMode === "USD"
                    ? "bg-emerald-500 text-black font-bold shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                USD
              </button>
            </div>

            {/* Shopping Cart button */}
            <button
              id="open-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-300 hover:text-emerald-400 transition-colors focus:outline-none"
              aria-label="Ver carrito"
            >
              <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 md:h-5 w-4 md:w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] md:text-xs font-bold text-black border border-black animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-emerald-400 focus:outline-none"
              aria-label="Abrir menú"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-black/95 border-t border-emerald-500/20 overflow-hidden"
            >
              <div className="flex flex-col gap-4 py-4 px-2 tracking-wide font-medium">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-300 hover:text-emerald-400 text-base py-1 px-2 border-l border-transparent hover:border-emerald-500 transition-all font-sans"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
              onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer UI */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-zinc-950 border-l border-emerald-500/30 z-50 shadow-2xl flex flex-col text-white"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="text-emerald-400 h-5 w-5" />
                  <h3 className="text-lg font-bold font-sans">Carrito de Compras</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 text-zinc-400 hover:text-emerald-400 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col justify-center items-center text-zinc-500 space-y-3">
                    <ShoppingCart className="h-12 w-12 text-zinc-700 stroke-[1.5]" />
                    <p className="text-center text-sm font-sans">
                      El carrito está vacío. ¡Explora la tienda online para sumar componentes!
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-emerald-500/30 transition-all"
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md bg-zinc-800 border border-zinc-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold truncate text-zinc-100">
                          {item.product.name}
                        </h4>
                        <div className="text-xs text-zinc-500 font-mono mt-1">
                          Ref: {item.product.category.toUpperCase()}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          {/* Quanity adjusts */}
                          <div className="flex items-center border border-zinc-700 rounded-md overflow-hidden bg-zinc-950">
                            <button
                              onClick={() =>
                                onUpdateCartQuantity(item.product.id, item.quantity - 1)
                              }
                              className="px-2 py-0.5 text-xs font-semibold text-zinc-400 hover:text-white"
                            >
                              -
                            </button>
                            <span className="px-2.5 py-0.5 text-xs text-emerald-400 font-mono font-bold bg-zinc-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onUpdateCartQuantity(item.product.id, item.quantity + 1)
                              }
                              className="px-2 py-0.5 text-xs font-semibold text-zinc-400 hover:text-white"
                              disabled={item.quantity >= item.product.stock}
                            >
                              +
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-emerald-400 font-mono">
                              {currencyMode === "ARS"
                                ? `$${(item.product.priceArs * item.quantity).toLocaleString("es-AR")} ARS`
                                : `u$s ${((item.product.priceArs * item.quantity) / usdRate).toFixed(2)}`}
                            </span>
                            <button
                              onClick={() => onRemoveFromCart(item.product.id)}
                              className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {cart.length > 0 && (
                <div className="p-6 bg-zinc-900/95 border-t border-zinc-800 space-y-4">
                  {/* Exchange dynamic monitor */}
                  <div className="flex items-center justify-between text-xs text-zinc-400 bg-zinc-950/80 p-2 rounded-md border border-zinc-800 font-mono">
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="h-3 w-3 text-emerald-400" /> Cotización USD (BNA):
                    </span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={exchangeInput}
                        onChange={(e) => handleUpdateExchange(e.target.value)}
                        className="w-16 bg-zinc-900 border border-emerald-500/30 rounded px-1.5 py-0.5 text-center text-emerald-400 focus:outline-none focus:border-emerald-500 text-[11px]"
                      />
                      <span>ARS/USD</span>
                    </div>
                  </div>

                  {/* Pricing Overview */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm text-zinc-400">
                      <span>Subtotal</span>
                      <span className="font-mono">
                        $ {cartTotalArs.toLocaleString("es-AR")} ARS
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-base font-bold text-emerald-400">
                      <span>Total General</span>
                      <span className="font-mono text-lg">
                        {currencyMode === "ARS"
                          ? `$ ${cartTotalArs.toLocaleString("es-AR")} ARS`
                          : `u$s ${cartTotalUsd.toFixed(2)} USD`}
                      </span>
                    </div>
                  </div>

                  {/* Action controls */}
                  <div className="space-y-2">
                    <button
                      onClick={handleCheckout}
                      disabled={isCheckoutSuccess}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:bg-zinc-700 disabled:text-zinc-400 text-black py-3 rounded-lg font-bold text-sm tracking-wide shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2"
                    >
                      {isCheckoutSuccess ? (
                        <>
                          <Check className="h-4 w-4" /> COMPRA PROCESADA
                        </>
                      ) : (
                        "INICIAR COMPRA DE HARDWARE"
                      )}
                    </button>
                    <button
                      onClick={onClearCart}
                      className="w-full py-1.5 text-center text-xs text-zinc-400 hover:text-red-400 font-medium transition-colors"
                    >
                      Vaciar Carrito
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Receipt Dialog */}
      <AnimatePresence>
        {isCheckoutSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-zinc-950 border-2 border-emerald-500 rounded-xl p-8 text-center text-white relative shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            >
              <div className="w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400 font-bold mb-6 animate-pulse">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h4 className="text-2xl font-bold font-sans tracking-wide text-emerald-400 mb-2">
                ¡Orden de Compra Generada!
              </h4>
              <p className="text-zinc-300 text-sm mb-6 leading-relaxed">
                Hemos reservado su hardware. Nuestro staff técnico de **LyC.Tech** se pondrá en contacto por email para organizar el cobro y coordinar la entrega o instalación opcional en laboratorio.
              </p>

              {/* Receipt detail */}
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg font-mono text-left text-xs mb-6 space-y-2">
                <div className="text-emerald-400 font-bold border-b border-zinc-800 pb-1 flex justify-between">
                  <span>RECIBO ORIGINAL</span>
                  <span>LYC-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                </div>
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-zinc-300">
                    <span className="truncate max-w-[200px]">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span>
                      $ {(item.product.priceArs * item.quantity).toLocaleString("es-AR")}
                    </span>
                  </div>
                ))}
                <div className="border-t border-zinc-800 pt-1.5 font-bold flex justify-between text-white text-sm">
                  <span>MONTO TOTAL ARS</span>
                  <span>$ {cartTotalArs.toLocaleString("es-AR")}</span>
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500 pt-1">
                  <span>TASA FIJADA:</span>
                  <span>1 USD = {usdRate.toFixed(2)} ARS</span>
                </div>
              </div>

              <div className="text-xs text-zinc-500 flex items-center justify-center gap-1.5 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Guardando recibo técnico...
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
