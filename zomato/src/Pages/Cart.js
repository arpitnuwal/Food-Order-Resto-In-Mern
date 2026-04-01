import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext'; 
import { FaTrash, FaArrowLeft, FaShoppingBag, FaTag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { cartItems, removeFromCart } = useCart(); 
  const navigate = useNavigate();

  // ✅ FIX: Page load hote hi scroll ko sabse upar bhej dega
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Total price calculation
  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div style={styles.pageContainer}>
      <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Montserrat:wght@200;400;600&display=swap');
          
          .cart-wrapper { 
            display: grid; 
            grid-template-columns: 1.8fr 1fr; 
            gap: 50px;
            align-items: start;
          }

          .cart-item { 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            border-bottom: 1px solid #1a1a1a; 
            padding: 25px 0;
            transition: 0.3s;
          }

          /* ✅ RESPONSIVE QUERIES */
          @media (max-width: 1024px) {
            .cart-wrapper { grid-template-columns: 1fr; gap: 40px; }
            .summary-container { position: relative !important; top: 0 !important; width: 100%; }
          }

          @media (max-width: 600px) {
            .page-container { padding: 100px 5% 50px !important; }
            .cart-item { flex-direction: column; align-items: flex-start; gap: 20px; }
            .item-action { width: 100%; display: flex; justify-content: space-between; align-items: center; text-align: left !important; }
            .remove-btn { margin-top: 0 !important; }
            .main-title { font-size: 32px !important; }
            .item-image-wrapper { width: 80px !important; height: 80px !important; }
            .item-name { font-size: 16px !important; }
          }
      `}</style>

      {/* Page Header */}
      <div style={styles.headerSection}>
        <h1 className="main-title" style={styles.mainTitle}>Your Plate</h1>
        <div style={styles.goldUnderline}></div>
      </div>
      
      {cartItems.length === 0 ? (
        <div style={styles.emptyContainer}>
          <FaShoppingBag size={50} color="#333" style={{ marginBottom: '20px' }} />
          <p style={styles.emptyText}>Your plate is empty. Add some luxury flavors!</p>
          <button onClick={() => navigate('/menu')} style={styles.backBtn}>
            <FaArrowLeft size={12} /> Back to Menu
          </button>
        </div>
      ) : (
        <div className="cart-wrapper" style={styles.cartWrapper}>
          <div style={styles.itemsList}>
            {cartItems.map(item => (
              <div key={item._id} className="cart-item" style={styles.cartItem}>
                <div style={styles.itemInfo}>
                  <div className="item-image-wrapper" style={styles.imageWrapper}>
                    <img 
                      src={`http://localhost:5000/image/${item.image}`} 
                      style={styles.itemImage} 
                      alt={item.name} 
                    />
                  </div>
                  <div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'}}>
                        <h4 className="item-name" style={styles.itemName}>{item.name}</h4>
                        {item.isFlashDeal && (
                            <span style={styles.offerBadge}>
                                <FaTag size={8} /> FLASH OFFER
                            </span>
                        )}
                    </div>
                    <p style={styles.itemQty}>Quantity: {item.quantity}</p>
                    <p style={styles.itemPriceSingle}>Unit Price: ₹{item.price}</p>
                  </div>
                </div>

                <div className="item-action" style={styles.itemAction}>
                  <p style={styles.itemTotalPrice}>₹{item.price * item.quantity}</p>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item._id)} 
                    style={styles.removeBtn}
                    title="Remove Item"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Section */}
          <div className="summary-container" style={styles.summaryContainer}>
            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Service Charge (Luxury)</span>
              <span style={{ color: '#f3cf7a' }}>FREE</span>
            </div>
            <hr style={styles.divider} />
            <div style={styles.totalRow}>
              <h3 style={{margin: 0}}>Grand Total</h3>
              <h3 style={{margin: 0}}>₹{total}</h3>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')} 
              style={styles.checkoutBtn}
            >
              Proceed to Checkout
            </button>
            
            <p onClick={() => navigate('/menu')} style={styles.continueShopping}>
              Continue Adding Delicacies
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  pageContainer: { 
    background: '#050505', 
    minHeight: '100vh', 
    padding: '120px 8% 50px 8%', 
    color: '#fff',
    fontFamily: "'Montserrat', sans-serif"
  },
  headerSection: { textAlign: 'center', marginBottom: '60px' },
  mainTitle: { 
    fontFamily: "'Marcellus', serif", 
    color: '#f3cf7a', 
    fontSize: '42px', 
    letterSpacing: '3px',
    marginBottom: '10px' 
  },
  goldUnderline: { 
    width: '60px', 
    height: '2px', 
    background: '#f3cf7a', 
    margin: '0 auto' 
  },
  cartWrapper: { }, // Handled by CSS class
  cartItem: { }, // Handled by CSS class
  itemInfo: { display: 'flex', alignItems: 'center', gap: '25px' },
  imageWrapper: {
    width: '100px',
    height: '100px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #222',
    flexShrink: 0
  },
  itemImage: { width: '100%', height: '100%', objectFit: 'cover' },
  itemName: { 
    fontFamily: "'Marcellus', serif", 
    color: '#f3cf7a', 
    fontSize: '20px', 
    margin: '0' 
  },
  offerBadge: {
    background: 'rgba(243, 207, 122, 0.1)',
    color: '#f3cf7a',
    fontSize: '9px',
    padding: '3px 8px',
    borderRadius: '4px',
    border: '1px solid rgba(243, 207, 122, 0.3)',
    fontWeight: 'bold',
    letterSpacing: '1px'
  },
  itemQty: { color: '#888', fontSize: '13px', margin: '5px 0 0 0' },
  itemPriceSingle: { color: '#555', fontSize: '12px', marginTop: '4px' },
  itemAction: { textAlign: 'right' },
  itemTotalPrice: { fontSize: '18px', fontWeight: '600', color: '#fff' },
  removeBtn: { 
    background: 'transparent', 
    border: 'none', 
    color: '#ff4444', 
    cursor: 'pointer', 
    marginTop: '15px',
    fontSize: '16px',
    opacity: '0.7',
    transition: '0.3s'
  },
  summaryContainer: { 
    background: '#0a0a0a', 
    padding: '40px', 
    borderRadius: '15px', 
    border: '1px solid #1a1a1a',
    position: 'sticky',
    top: '120px'
  },
  summaryRow: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    marginBottom: '15px',
    color: '#aaa',
    fontSize: '14px'
  },
  totalRow: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    margin: '20px 0',
    color: '#f3cf7a'
  },
  divider: { border: '0', borderTop: '1px solid #222', margin: '20px 0' },
  checkoutBtn: {
    width: '100%',
    background: '#f3cf7a',
    color: '#000',
    border: 'none',
    padding: '16px',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '2px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    borderRadius: '4px',
    transition: '0.4s'
  },
  continueShopping: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '12px',
    color: '#888',
    cursor: 'pointer',
    textDecoration: 'underline'
  },
  emptyContainer: { textAlign: 'center', padding: '100px 0' },
  emptyText: { color: '#666', fontSize: '18px', marginBottom: '30px' },
  backBtn: {
    background: 'transparent',
    border: '1px solid #f3cf7a',
    color: '#f3cf7a',
    padding: '12px 25px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px'
  }
};

export default Cart;