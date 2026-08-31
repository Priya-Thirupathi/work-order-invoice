A small MERN + TypeScript app implementing the flow
  **Customer → Work Order → Complete → Invoice**, with PDF download and
  email delivery.

  ## Stack

  | Layer    | Choice                                    |
  | -------- | ----------------------------------------- |
  | Frontend | React 19, Vite, TypeScript                |
  | Backend  | Node, Express 5, TypeScript (ESM)         |
  | Database | MongoDB via Mongoose 9                    |
  | PDF      | PDFKit                                    |
  | Email    | Nodemailer (Ethereal for local testing)   |

  ## Setup

  Requires Node 22+ (developed on v24) and a running MongoDB.

  ```bash
  docker run -d --name mongo-woi -p 27017:27017 mongo:7
  ```

  ```bash
  npm install
  npm --prefix server install
  npm --prefix client install
  cp server/.env.example server/.env
  ```

  ## Environment

  | Variable       | Purpose                                               |
  | -------------- | ----------------------------------------------------- |
  | `PORT`         | API port (default 5000)                               |
  | `MONGODB_URI`  | `mongodb://127.0.0.1:27017/work_order_invoice`        |
  | `MAIL_FROM`    | From header on invoice emails                         |
  | `SMTP_HOST`    | SMTP host — **leave blank** to auto-create an Ethereal test account |
  | `SMTP_PORT`    | 587 (STARTTLS) or 465 (TLS)                           |
  | `SMTP_USER`    | SMTP username                                         |
  | `SMTP_PASS`    | SMTP password                                         |

  With `SMTP_HOST` blank the server creates an [Ethereal](https://ethereal.email)
  test account on first send and logs the account name. The send response
  includes a `previewUrl` where the delivered email and its PDF attachment can
  be viewed — no mail client needed.

  ## Running

  ```bash
  npm run dev
  ```

  Starts both: API on `http://localhost:5000`, UI on `http://localhost:5173`
  (Vite proxies `/api` to the API).

  ## API

  | Method | Route                          | Purpose                            |
  | ------ | ------------------------------ | ---------------------------------- |
  | POST   | `/api/customers`               | Create a customer                  |
  | GET    | `/api/customers`               | List customers                     |
  | POST   | `/api/work-orders`             | Create a work order                |
  | GET    | `/api/work-orders`             | List work orders (customer populated) |
  | PUT    | `/api/work-orders/:id`         | Update status                      |
  | POST   | `/api/work-orders/:id/invoice` | Generate the invoice               |
  | GET    | `/api/invoices/:id`            | Fetch an invoice                   |
  | GET    | `/api/invoices/:id/pdf`        | Download the invoice PDF           |
  | POST   | `/api/invoices/:id/send-email` | Email the invoice with PDF attached |

  GST is fixed at 9% and calculated server-side; it is never sent by the client.


