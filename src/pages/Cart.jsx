import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import SideNav from "../components/SideNav";
import ModuleHeader from "../components/ModuleHeader";
import CartEmptyState from "../components/cart/CartEmptyState";
import PurchasableSection from "../components/cart/PurchasableSection";
import SavedItemRow from "../components/cart/SavedItemRow";
import { UseAppContext } from "../context/AppContext";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function Cart() {
  useDocumentTitle("Cart");

  const location = useLocation();
  const navigate = useNavigate();

  const {
    cart = [],
    setCart,
    isOpen,
    setIsOpen,
    updateShopQty,
    removeShopItem,
    placeShopOrder,
    updateMarketplaceQty,
    removeMarketplaceItem,
    placeMarketplaceOrder,
  } = UseAppContext();

  const baseRolePath = location.pathname.startsWith("/serviceprovider")
    ? "/serviceprovider"
    : "/farmer";

  const { shopItems, mktItems, otherItems, shopTotal, mktTotal } = useMemo(() => {
    const shop = cart.filter((item) => item.cartModule === "Shop");
    const mkt = cart.filter((item) => item.cartModule === "Marketplace");
    const other = cart.filter(
      (item) => item.cartModule !== "Shop" && item.cartModule !== "Marketplace"
    );

    const sTotal = shop.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
    const mTotal = mkt.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );

    return {
      shopItems: shop,
      mktItems: mkt,
      otherItems: other,
      shopTotal: sTotal,
      mktTotal: mTotal,
    };
  }, [cart]);

  // Shop Handlers
  const handleShopIncrease = (id) => updateShopQty(id, "Shop", 1);
  const handleShopDecrease = (id) => updateShopQty(id, "Shop", -1);
  const handleShopRemove = (id) => removeShopItem(id, "Shop");
  const handleShopPay = (items, total) => {
    placeShopOrder(items, total);
    setCart((prev) => prev.filter((item) => item.cartModule !== "Shop"));
  };

  // Marketplace Handlers
  const handleMktIncrease = (id) => updateMarketplaceQty(id, "Marketplace", 1);
  const handleMktDecrease = (id) => updateMarketplaceQty(id, "Marketplace", -1);
  const handleMktRemove = (id) => removeMarketplaceItem(id, "Marketplace");
  const handleMktPay = (items, total) => {
    placeMarketplaceOrder(items, total);
    setCart((prev) => prev.filter((item) => item.cartModule !== "Marketplace"));
  };

  // Saved Items Handler
  const handleRemoveOther = (id) => {
    setCart((prev) => prev.filter((item) => (item.id || item._id) !== id));
  };

  return (
    <div className="min-h-dvh bg-black font-montserrat">
      <SideNav />

      <div
        className={`flex min-h-dvh flex-col transition-[margin] duration-300 ${
          isOpen ? "md:ml-62.5" : "md:ml-20"
        }`}
      >
        <div className="mx-2 my-4 flex flex-1 flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-black shadow-2xl md:mx-6">
          <ModuleHeader
            title="Cart"
            search=""
            onSearchChange={() => {}}
            onOpenSidebar={() => setIsOpen(!isOpen)}
          />

          <main className="flex-1 overflow-y-auto p-6 md:p-7">
            {cart.length === 0 ? (
              <CartEmptyState
                onBrowseShop={() => navigate(`${baseRolePath}/shop`)}
                onBrowseMarketplace={() => navigate(`${baseRolePath}/marketplace`)}
              />
            ) : (
              <div className="flex flex-col gap-8">
                {shopItems.length > 0 && (
                  <PurchasableSection
                    title="Shop Items"
                    subtitle={`${shopItems.length} item${shopItems.length !== 1 ? "s" : ""} from the shop`}
                    items={shopItems}
                    total={shopTotal}
                    onIncrease={handleShopIncrease}
                    onDecrease={handleShopDecrease}
                    onRemove={handleShopRemove}
                    onPay={handleShopPay}
                    moduleLabel="Shop"
                  />
                )}

                {mktItems.length > 0 && (
                  <PurchasableSection
                    title="Marketplace Items"
                    subtitle={`${mktItems.length} item${mktItems.length !== 1 ? "s" : ""} from farmers`}
                    items={mktItems}
                    total={mktTotal}
                    onIncrease={handleMktIncrease}
                    onDecrease={handleMktDecrease}
                    onRemove={handleMktRemove}
                    onPay={handleMktPay}
                    moduleLabel="Marketplace"
                  />
                )}

                {otherItems.length > 0 && (
                  <section className="rounded-[22px] border border-gold/15 bg-[#040404] p-5 md:p-6">
                    <div className="mb-4 border-b border-gold/10 pb-3">
                      <h2 className="text-lg font-black text-white/60">Saved for Later</h2>
                      <p className="mt-1 text-xs text-white/40">
                        Items from other modules — visit each module to proceed
                      </p>
                    </div>
                    <div className="flex flex-col gap-3">
                      {otherItems.map((item, index) => (
                        <SavedItemRow
                          key={item.id || item._id || index}
                          item={item}
                          onRemove={handleRemoveOther}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}