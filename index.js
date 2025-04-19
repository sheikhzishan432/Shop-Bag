const productsWrapper = document.getElementById("productsWrapper")
const cartProducts = document.getElementById("cartProducts")
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
const navMenu = document.querySelector(".nav2")

// Mobile menu toggle
if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active")

    // Animate the hamburger icon
    const spans = mobileMenuToggle.querySelectorAll("span")
    if (navMenu.classList.contains("active")) {
      spans[0].style.transform = "rotate(45deg) translate(5px, 5px)"
      spans[1].style.opacity = "0"
      spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)"
    } else {
      spans[0].style.transform = "none"
      spans[1].style.opacity = "1"
      spans[2].style.transform = "none"
    }
  })
}

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (
    navMenu &&
    navMenu.classList.contains("active") &&
    !e.target.closest(".nav2") &&
    !e.target.closest(".mobile-menu-toggle")
  ) {
    navMenu.classList.remove("active")

    // Reset hamburger icon
    if (mobileMenuToggle) {
      const spans = mobileMenuToggle.querySelectorAll("span")
      spans[0].style.transform = "none"
      spans[1].style.opacity = "1"
      spans[2].style.transform = "none"
    }
  }
})

let cartItems = []

// Load cart items from localStorage on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedCart = localStorage.getItem("cart")
  if (savedCart) {
    cartItems = JSON.parse(savedCart)
    DisplayCartItems()
  }
})

// Intersection Observer for animation on scroll
const observeElements = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Set a custom property for staggered animations
          entry.target.style.setProperty("--i", index)
          entry.target.classList.add("animate")
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 },
  )

  // Observe section titles
  document.querySelectorAll(".ari21, .home3 > .right1").forEach((el) => {
    observer.observe(el)
  })
}

//! TO FETCH DATA FROM API
async function fetchProducts() {
  const response = await fetch("https://fakestoreapi.com/products")
  const allproducts = await response.json()
  DisplayProducts(allproducts) //! SENDING ALL_PRODUCTS TO DisplayProducts func

  // Initialize animations after products are loaded
  observeElements()
}

fetchProducts()

function DisplayProducts(products) {
  products.map((product, index) => {
    //! CREATING ELEMENTS
    const card = document.createElement("section")
    const image = document.createElement("img")
    const product_title = document.createElement("h2")
    const product_desc = document.createElement("p")
    const product_price = document.createElement("p")
    const add_to_cart_btn = document.createElement("button")

    //! ADDING TEXT CONTENT
    product_title.textContent = product.title.slice(0, 35)
    product_desc.textContent = `${product.description.slice(0, 20)}...`
    product_price.innerHTML = `&#8377; ${product.price}`
    add_to_cart_btn.textContent = "Add to cart"

    //! SETTING ATTRIBUTE
    card.setAttribute("class", "card")
    card.style.setProperty("--i", index) // For staggered animation
    image.setAttribute("src", product.image)
    image.setAttribute("alt", product.title)
    image.setAttribute("loading", "lazy") // Lazy load images

    // Add animation when card comes into view
    setTimeout(() => {
      card.style.opacity = "1"
    }, 100 * index)

    add_to_cart_btn.addEventListener("click", () => {
      console.log("item added to cart")
      console.log(product)

      // Add animation to button
      add_to_cart_btn.classList.add("adding")
      setTimeout(() => {
        add_to_cart_btn.classList.remove("adding")
      }, 500)

      // finding if product exists in cart or not
      const existingProduct = cartItems.find((ele) => ele.id === product.id)

      // if it exists, increase quantity +1
      if (existingProduct) {
        existingProduct.quantity += 1
      } else {
        // push product in cart with a new key i.e, quantity
        cartItems.push({ ...product, quantity: 1 })
        add_to_cart_btn.textContent = "Add More"
      }

      localStorage.setItem("cart", JSON.stringify(cartItems))
      console.log(cartItems)
      DisplayCartItems() //calling  function DisplayCartItems(){
    })

    card.append(image, product_title, product_desc, product_price, add_to_cart_btn)
    productsWrapper.append(card)
  })
}

function DisplayCartItems() {
  console.log("DisplayCartItems called")

  //clearing pervious html
  cartProducts.innerHTML = ""

  //fetching cart items from localstorage
  const cartData = JSON.parse(localStorage.getItem("cart")) || []
  console.log(cartData)

  if (cartData.length === 0) {
    const emptyCart = document.createElement("div")
    emptyCart.className = "empty-cart"
    emptyCart.innerHTML = `
            <h2>Your cart is empty</h2>
            <p>Add some products to your cart</p>
        `
    cartProducts.appendChild(emptyCart)
    return
  }

  //iterating cart items and displaying on UI
  cartData.forEach((item, index) => {
    const cartcard = document.createElement("article")
    const itemimage = document.createElement("img")
    const itemtitel = document.createElement("h1")
    const itemquality = document.createElement("p")
    const itemprice = document.createElement("p")

    itemimage.setAttribute("src", item.image)
    itemimage.setAttribute("alt", item.title)

    itemtitel.textContent = item.title
    itemquality.textContent = `Quantity: ${item.quantity}`
    itemprice.textContent = `Price: ₹${(item.quantity * item.price).toFixed(2)}`

    // Add animation to cart items
    cartcard.style.animationDelay = `${index * 0.1}s`

    cartcard.append(itemimage, itemtitel, itemquality, itemprice)
    cartProducts.append(cartcard)
  })
}
