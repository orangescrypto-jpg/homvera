import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function EscrowAgreement() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-16 max-w-4xl">
        <div className="mb-10">
          <p className="text-sm text-muted-foreground mb-2">Last updated: May 1, 2026</p>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Escrow Agreement</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            This Escrow Agreement governs the use of Homvera NG's escrow payment service, powered by Stripe. By initiating an escrow transaction, you agree to these terms.
          </p>
        </div>
        <div className="space-y-8">
          {[
            { title: "1. Escrow Service Overview", content: "Homvera NG provides an escrow service to facilitate secure transactions between buyers and sellers. When a buyer initiates an escrow payment, funds are collected by Stripe and held in a designated escrow account until the transaction conditions are met. Homvera NG acts as the escrow agent." },
            { title: "2. Initiating Escrow", content: "To initiate an escrow transaction, the buyer must: (a) confirm the transaction details including amount and description; (b) provide payment information via Stripe; (c) fund the escrow account. The escrow is considered active once Stripe confirms the payment." },
            { title: "3. Escrow Funding", content: "All escrow funds are processed through Stripe's secure payment infrastructure. Funds are held in accordance with Stripe's terms of service and applicable financial regulations. Homvera NG does not have direct access to your payment card information." },
            { title: "4. Delivery Confirmation", content: "Once the seller has fulfilled their obligations (delivered the property, completed the service, etc.), the buyer must confirm delivery within 7 days. If the buyer does not confirm or dispute within 7 days, funds may be automatically released to the seller. Confirmation is irreversible." },
            { title: "5. Fund Release", content: "Upon buyer confirmation of delivery, Homvera NG will instruct Stripe to release funds to the seller, minus applicable platform fees. Fund release typically occurs within 3-5 business days. The seller must have a valid Stripe account or bank details on file to receive funds." },
            { title: "6. Dispute Resolution", content: "Either party may open a dispute before delivery is confirmed. To open a dispute, provide a detailed explanation of the issue. Homvera NG will review the dispute within 5 business days and may request additional documentation. Our decision on disputes is final and binding." },
            { title: "7. Refunds", content: "Refunds are issued when: (a) a dispute is resolved in the buyer's favor; (b) the seller cancels the transaction; (c) the listing is found to be fraudulent. Refunds are processed back to the original payment method within 5-10 business days." },
            { title: "8. Platform Fees", content: "Homvera NG charges a platform fee of 2.5% on completed escrow transactions, deducted from the seller's payout. Stripe's payment processing fees are separate and disclosed at checkout. No fees are charged on refunded transactions." },
            { title: "9. Prohibited Transactions", content: "Escrow may not be used for illegal transactions, money laundering, or any activity that violates Nigerian law. We reserve the right to freeze escrow funds pending investigation of suspicious activity and to cooperate with law enforcement." },
            { title: "10. Limitation of Liability", content: "Homvera NG's liability as escrow agent is limited to the amount held in escrow for the specific transaction. We are not liable for losses arising from fraudulent listings, misrepresentation by parties, or events beyond our control." },
          ].map(s => (
            <section key={s.title}>
              <h2 className="text-xl font-serif font-semibold text-foreground mb-3">{s.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{s.content}</p>
            </section>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
