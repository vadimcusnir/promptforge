"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  Crown,
  User,
  Trash2,
  Edit,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
} from "lucide-react"

// Mock members data
const mockMembers = [
  {
    id: "1",
    email: "admin@promptforge.com",
    fullName: "Admin User",
    role: "owner",
    status: "active",
    joinedAt: "2023-01-15T10:30:00Z",
    lastActive: "2024-01-15T14:20:00Z",
    avatar: null,
    invitedBy: null,
    invitationSentAt: null,
  },
  {
    id: "2",
    email: "manager@promptforge.com",
    fullName: "Manager User",
    role: "admin",
    status: "active",
    joinedAt: "2023-03-20T09:15:00Z",
    lastActive: "2024-01-14T16:45:00Z",
    avatar: null,
    invitedBy: "admin@promptforge.com",
    invitationSentAt: "2023-03-18T10:00:00Z",
  },
  {
    id: "3",
    email: "developer@promptforge.com",
    fullName: "Developer User",
    role: "member",
    status: "active",
    joinedAt: "2023-06-10T11:00:00Z",
    lastActive: "2024-01-13T12:30:00Z",
    avatar: null,
    invitedBy: "manager@promptforge.com",
    invitationSentAt: "2023-06-08T14:30:00Z",
  },
  {
    id: "4",
    email: "pending@promptforge.com",
    fullName: null,
    role: "member",
    status: "pending",
    joinedAt: "2024-01-10T08:00:00Z",
    lastActive: null,
    avatar: null,
    invitedBy: "admin@promptforge.com",
    invitationSentAt: "2024-01-10T08:00:00Z",
  },
]

const mockSubscription = {
  seatsIncluded: 5,
  seatsUsed: 3,
  plan: "Pro",
  nextBillingDate: "2024-02-15",
  seatPrice: 25, // per seat per month
}

export default function AdminMembri() {
  const [members, setMembers] = useState(mockMembers)
  const [searchTerm, setSearchTerm] = useState("")
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("member")
  const [editingMember, setEditingMember] = useState<string | null>(null)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [isInviting, setIsInviting] = useState(false)
  const [showSeatPurchase, setShowSeatPurchase] = useState(false)
  const [additionalSeats, setAdditionalSeats] = useState(1)

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("[v0] Admin members view tracked", { memberCount: members.length, searchTerm })
    }
  }, [members.length, searchTerm])

  const filteredMembers = members.filter(
    (member) =>
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.fullName && member.fullName.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getRoleBadge = (role: string) => {
    const variants = {
      owner: "bg-purple-900 text-purple-300",
      admin: "bg-blue-900 text-blue-300",
      member: "bg-gray-700 text-gray-300",
    }
    return variants[role as keyof typeof variants] || variants.member
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4" />
      case "admin":
        return <Shield className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-900 text-green-300",
      pending: "bg-yellow-900 text-yellow-300",
      suspended: "bg-red-900 text-red-300",
    }
    return variants[status as keyof typeof variants] || variants.active
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const canChangeRole = (member: any, currentUserRole: string) => {
    if (currentUserRole === "owner" && member.role !== "owner") return true
    if (currentUserRole === "admin" && member.role === "member") return true
    return false
  }

  const canRemoveMember = (member: any, currentUserRole: string) => {
    const ownerCount = members.filter((m) => m.role === "owner").length
    if (member.role === "owner" && ownerCount === 1) return false

    if (currentUserRole === "owner") return true
    if (currentUserRole === "admin" && member.role === "member") return true
    return false
  }

  const handleInviteMember = async () => {
    if (!inviteEmail) return

    setIsInviting(true)
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(inviteEmail)) {
        alert("Please enter a valid email address")
        return
      }

      // Check if email already exists
      if (members.some((m) => m.email.toLowerCase() === inviteEmail.toLowerCase())) {
        alert("This email is already associated with a team member")
        return
      }

      const newMember = {
        id: Date.now().toString(),
        email: inviteEmail,
        fullName: null,
        role: inviteRole,
        status: "pending",
        joinedAt: new Date().toISOString(),
        lastActive: null,
        avatar: null,
        invitedBy: "current-admin@promptforge.com", // In real app, get from session
        invitationSentAt: new Date().toISOString(),
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setMembers([...members, newMember])

      // Log admin action
      console.log("[v0] Member invited", {
        email: inviteEmail,
        role: inviteRole,
        invitedBy: "current-admin",
        timestamp: new Date().toISOString(),
      })

      setInviteEmail("")
      setInviteRole("member")
      setShowInviteModal(false)

      alert(`Invitation sent to ${inviteEmail}`)
    } catch (error) {
      console.error("[v0] Failed to invite member", error)
      alert("Failed to send invitation. Please try again.")
    } finally {
      setIsInviting(false)
    }
  }

  const handleRoleChange = async (memberId: string, newRole: string) => {
    const member = members.find((m) => m.id === memberId)
    if (!member) return

    // Guard against removing last owner
    if (member.role === "owner" && newRole !== "owner") {
      const ownerCount = members.filter((m) => m.role === "owner").length
      if (ownerCount === 1) {
        alert("Cannot change role: This is the last owner of the organization")
        return
      }
    }

    // Confirm critical role changes
    if (newRole === "owner") {
      const confirmed = window.confirm(
        `Are you sure you want to make ${member.email} an owner? This will grant them full administrative access.`,
      )
      if (!confirmed) return
    }

    try {
      setMembers(members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)))

      // Log admin action
      console.log("[v0] Member role changed", {
        memberId,
        memberEmail: member.email,
        oldRole: member.role,
        newRole,
        changedBy: "current-admin",
        timestamp: new Date().toISOString(),
      })

      setEditingMember(null)
    } catch (error) {
      console.error("[v0] Failed to change member role", error)
      alert("Failed to change member role. Please try again.")
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    const member = members.find((m) => m.id === memberId)
    if (!member) return

    const confirmed = window.confirm(
      `Are you sure you want to remove ${member.email} from the organization? This action cannot be undone.`,
    )
    if (!confirmed) return

    try {
      setMembers(members.filter((m) => m.id !== memberId))

      // Log admin action
      console.log("[v0] Member removed", {
        memberId,
        memberEmail: member.email,
        memberRole: member.role,
        removedBy: "current-admin",
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("[v0] Failed to remove member", error)
      alert("Failed to remove member. Please try again.")
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedMembers.length === 0) return

    const confirmed = window.confirm(`Are you sure you want to ${action} ${selectedMembers.length} selected member(s)?`)
    if (!confirmed) return

    try {
      if (action === "remove") {
        setMembers(members.filter((m) => !selectedMembers.includes(m.id)))
      } else if (action === "resend-invite") {
        // Simulate resending invitations
        console.log("[v0] Bulk resend invitations", { memberIds: selectedMembers })
      }

      setSelectedMembers([])

      console.log("[v0] Bulk action performed", {
        action,
        memberCount: selectedMembers.length,
        performedBy: "current-admin",
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("[v0] Failed to perform bulk action", error)
      alert("Failed to perform bulk action. Please try again.")
    }
  }

  const handlePurchaseSeats = async () => {
    try {
      const totalCost = additionalSeats * mockSubscription.seatPrice

      console.log("[v0] Seat purchase initiated", {
        additionalSeats,
        totalCost,
        currentPlan: mockSubscription.plan,
        timestamp: new Date().toISOString(),
      })

      // In real implementation, this would redirect to Stripe Checkout
      alert(`Redirecting to payment for ${additionalSeats} additional seats ($${totalCost}/month)`)
      setShowSeatPurchase(false)
    } catch (error) {
      console.error("[v0] Failed to initiate seat purchase", error)
      alert("Failed to initiate seat purchase. Please try again.")
    }
  }

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    }
    return email.substring(0, 2).toUpperCase()
  }

  const seatsAvailable = mockSubscription.seatsIncluded - mockSubscription.seatsUsed
  const needsMoreSeats = seatsAvailable <= 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#CDA434] mb-2">Team Members</h1>
          <p className="text-gray-400">Manage your organization's team members and permissions</p>
        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          {selectedMembers.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("resend-invite")}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 focus:ring-2 focus:ring-[#00FF7F]"
              >
                Resend Invites
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("remove")}
                className="border-red-700 text-red-300 hover:bg-red-800 focus:ring-2 focus:ring-[#00FF7F]"
              >
                Remove Selected
              </Button>
            </div>
          )}
          <Button
            className="bg-[#CDA434] text-black hover:bg-[#CDA434]/90 focus:ring-2 focus:ring-[#00FF7F]"
            onClick={() => setShowInviteModal(true)}
            disabled={needsMoreSeats}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </div>

      {needsMoreSeats && (
        <Alert className="border-yellow-600 bg-yellow-900/20">
          <AlertTriangle className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-300">
            You've reached your seat limit. Purchase additional seats to invite more team members.
          </AlertDescription>
        </Alert>
      )}

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#CDA434] flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Seat Usage
            </CardTitle>
            <Badge className={needsMoreSeats ? "bg-red-900 text-red-300" : "bg-green-900 text-green-300"}>
              {mockSubscription.seatsUsed} / {mockSubscription.seatsIncluded} used
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">
                <span className="font-bold">{mockSubscription.seatsUsed}</span> of{" "}
                <span className="font-bold">{mockSubscription.seatsIncluded}</span> seats used
              </p>
              <p className="text-sm text-gray-400">
                {mockSubscription.plan} plan • ${mockSubscription.seatPrice}/seat/month •{" "}
                {seatsAvailable > 0 ? `${seatsAvailable} seats available` : "No seats available"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {needsMoreSeats && <AlertTriangle className="h-4 w-4 text-yellow-400" />}
              <Button
                variant="outline"
                onClick={() => setShowSeatPurchase(true)}
                className="border-[#CDA434] text-[#CDA434] hover:bg-[#CDA434] hover:text-black bg-transparent focus:ring-2 focus:ring-[#00FF7F]"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {needsMoreSeats ? "Add More Seats" : "Manage Seats"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-900 border-gray-700 focus:ring-2 focus:ring-[#00FF7F]"
        />
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#CDA434]">Team Members ({filteredMembers.length})</CardTitle>
            {selectedMembers.length > 0 && (
              <Badge className="bg-blue-900 text-blue-300">{selectedMembers.length} selected</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
              >
                <div className="flex items-center space-x-4">
                  <Checkbox
                    checked={selectedMembers.includes(member.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedMembers([...selectedMembers, member.id])
                      } else {
                        setSelectedMembers(selectedMembers.filter((id) => id !== member.id))
                      }
                    }}
                    className="focus:ring-2 focus:ring-[#00FF7F]"
                  />
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar || undefined} />
                    <AvatarFallback className="bg-[#CDA434] text-black">
                      {getInitials(member.fullName, member.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-white">{member.fullName || member.email}</h3>
                      <Badge className={getRoleBadge(member.role)}>
                        {getRoleIcon(member.role)}
                        <span className="ml-1 capitalize">{member.role}</span>
                      </Badge>
                      <Badge className={getStatusBadge(member.status)}>
                        {getStatusIcon(member.status)}
                        <span className="ml-1">{member.status}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{member.email}</span>
                      <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
                      {member.lastActive && <span>Last active {new Date(member.lastActive).toLocaleDateString()}</span>}
                      {member.status === "pending" && member.invitationSentAt && (
                        <span>Invited {new Date(member.invitationSentAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {editingMember === member.id ? (
                    <div className="flex items-center space-x-2">
                      <Select value={member.role} onValueChange={(newRole) => handleRoleChange(member.id, newRole)}>
                        <SelectTrigger className="w-32 bg-gray-700 border-gray-600 focus:ring-2 focus:ring-[#00FF7F]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingMember(null)}
                        className="text-gray-400 hover:text-white focus:ring-2 focus:ring-[#00FF7F]"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      {canChangeRole(member, "owner") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingMember(member.id)}
                          className="text-gray-400 hover:text-white focus:ring-2 focus:ring-[#00FF7F]"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {canRemoveMember(member, "owner") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-gray-400 hover:text-red-400 focus:ring-2 focus:ring-[#00FF7F]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-900 border-gray-800 w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-[#CDA434]">Invite Team Member</CardTitle>
              <CardDescription className="text-gray-400">Send an invitation to join your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address..."
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 mt-1 focus:ring-2 focus:ring-[#00FF7F]"
                />
              </div>
              <div>
                <Label htmlFor="role" className="text-gray-300">
                  Role
                </Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 mt-1 focus:ring-2 focus:ring-[#00FF7F]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowInviteModal(false)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 focus:ring-2 focus:ring-[#00FF7F]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInviteMember}
                  className="bg-[#CDA434] text-black hover:bg-[#CDA434]/90 focus:ring-2 focus:ring-[#00FF7F]"
                  disabled={!inviteEmail || isInviting}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {isInviting ? "Sending..." : "Send Invite"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Seat Purchase Modal */}
      {showSeatPurchase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-900 border-gray-800 w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-[#CDA434]">Purchase Additional Seats</CardTitle>
              <CardDescription className="text-gray-400">
                Add more seats to your {mockSubscription.plan} plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seats" className="text-gray-300">
                  Additional Seats
                </Label>
                <Input
                  id="seats"
                  type="number"
                  min="1"
                  max="50"
                  value={additionalSeats}
                  onChange={(e) => setAdditionalSeats(Number.parseInt(e.target.value) || 1)}
                  className="bg-gray-800 border-gray-700 mt-1 focus:ring-2 focus:ring-[#00FF7F]"
                />
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Price per seat:</span>
                  <span className="text-white">${mockSubscription.seatPrice}/month</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Additional seats:</span>
                  <span className="text-white">{additionalSeats}</span>
                </div>
                <div className="flex justify-between font-medium text-lg border-t border-gray-700 pt-2 mt-2">
                  <span className="text-[#CDA434]">Total monthly cost:</span>
                  <span className="text-[#CDA434]">${additionalSeats * mockSubscription.seatPrice}</span>
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowSeatPurchase(false)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 focus:ring-2 focus:ring-[#00FF7F]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePurchaseSeats}
                  className="bg-[#CDA434] text-black hover:bg-[#CDA434]/90 focus:ring-2 focus:ring-[#00FF7F]"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Purchase Seats
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
