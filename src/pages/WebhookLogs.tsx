import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { RefreshCw, Download, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

const WebhookLogs: React.FC = () => {
   const [logs, setLogs] = useState<any[]>([])
   const [loading, setLoading] = useState(false)
   const [stats, setStats] = useState<any>(null)

   const fetchWebhookLogs = async () => {
      setLoading(true)
      try {
         const response = await fetch('/api/debug/webhook-logs')
         const data = await response.json()
         
         if (data.success) {
            setLogs(data.logs || [])
            setStats(data.stats || null)
            toast.success(`Loaded ${data.logs?.length || 0} webhook logs`)
         } else {
            toast.error(`Failed to fetch logs: ${data.error}`)
         }
      } catch (error) {
         console.error('Failed to fetch webhook logs:', error)
         toast.error('Failed to fetch webhook logs')
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      fetchWebhookLogs()
   }, [])

   const getEventTypeColor = (eventType: string) => {
      switch (eventType) {
         case 'payment.succeeded':
         case 'payment.completed':
            return 'bg-green-500/20 text-green-400 border-green-500/30'
         case 'payment.failed':
         case 'payment.declined':
            return 'bg-red-500/20 text-red-400 border-red-500/30'
         case 'payment.cancelled':
         case 'payment.canceled':
            return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
         case 'payment.pending':
         case 'payment.processing':
            return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
         default:
            return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      }
   }

   const formatTimestamp = (timestamp: string) => {
      return new Date(timestamp).toLocaleString()
   }

   const exportLogs = () => {
      const dataStr = JSON.stringify(logs, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `webhook-logs-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
      toast.success('Logs exported successfully')
   }

   return (
      <div className='min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8'>
         <div className='max-w-6xl mx-auto space-y-6'>
            <div className="flex items-center justify-between">
               <h1 className='text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                  Webhook Event Logs
               </h1>
               <div className="flex gap-2">
                  <Button
                     onClick={fetchWebhookLogs}
                     disabled={loading}
                     className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                     <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                     Refresh
                  </Button>
                  <Button
                     onClick={exportLogs}
                     variant="outline"
                     className="border-white/20 text-white hover:bg-white/10"
                     disabled={logs.length === 0}
                  >
                     <Download className="w-4 h-4 mr-2" />
                     Export
                  </Button>
               </div>
            </div>

            {/* Stats */}
            {stats && (
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                     <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-white">{stats.total}</div>
                        <div className="text-sm text-gray-400">Total Events</div>
                     </CardContent>
                  </Card>
                  <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                     <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-400">{stats.succeeded || 0}</div>
                        <div className="text-sm text-gray-400">Succeeded</div>
                     </CardContent>
                  </Card>
                  <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                     <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-400">{stats.failed || 0}</div>
                        <div className="text-sm text-gray-400">Failed</div>
                     </CardContent>
                  </Card>
                  <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                     <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-400">{stats.other || 0}</div>
                        <div className="text-sm text-gray-400">Other</div>
                     </CardContent>
                  </Card>
               </div>
            )}

            {/* Logs */}
            <div className="space-y-4">
               {logs.length === 0 ? (
                  <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                     <CardContent className="p-8 text-center">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">No Webhook Logs Found</h3>
                        <p className="text-gray-400 mb-4">
                           No webhook events have been logged yet. This could mean:
                        </p>
                        <ul className="text-sm text-gray-400 text-left max-w-md mx-auto space-y-1">
                           <li>• No payments have been attempted</li>
                           <li>• Webhook URL is incorrect in DODO dashboard</li>
                           <li>• DODO is unable to reach your webhook endpoint</li>
                           <li>• Events are not configured in DODO dashboard</li>
                        </ul>
                     </CardContent>
                  </Card>
               ) : (
                  logs.map((log, index) => (
                     <Card key={index} className="bg-white/5 backdrop-blur-md border border-white/10">
                        <CardHeader className="pb-2">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                 <Badge className={getEventTypeColor(log.event_type)}>
                                    {log.event_type || 'unknown'}
                                 </Badge>
                                 {log.payment_id && (
                                    <Badge variant="outline" className="border-white/20 text-gray-300">
                                       {log.payment_id}
                                    </Badge>
                                 )}
                              </div>
                              <div className="text-sm text-gray-400">
                                 {formatTimestamp(log.timestamp)}
                              </div>
                           </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                 <h4 className="text-sm font-semibold text-gray-300 mb-2">Headers</h4>
                                 <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                       <span className="text-gray-400">Webhook ID:</span>
                                       <span className="text-white">{log.headers['webhook-id'] || 'Missing'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                       <span className="text-gray-400">Signature:</span>
                                       <span className="text-white">{log.headers['webhook-signature']}</span>
                                    </div>
                                    <div className="flex justify-between">
                                       <span className="text-gray-400">Timestamp:</span>
                                       <span className="text-white">{log.headers['webhook-timestamp'] || 'Missing'}</span>
                                    </div>
                                 </div>
                              </div>
                              
                              <div>
                                 <h4 className="text-sm font-semibold text-gray-300 mb-2">Request Info</h4>
                                 <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                       <span className="text-gray-400">Method:</span>
                                       <span className="text-white">{log.method}</span>
                                    </div>
                                    <div className="flex justify-between">
                                       <span className="text-gray-400">Content-Type:</span>
                                       <span className="text-white">{log.headers['content-type'] || 'None'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                       <span className="text-gray-400">User-Agent:</span>
                                       <span className="text-white text-xs truncate max-w-[200px]" title={log.headers['user-agent']}>
                                          {log.headers['user-agent'] || 'None'}
                                       </span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           
                           {log.body && (
                              <div className="mt-4">
                                 <h4 className="text-sm font-semibold text-gray-300 mb-2">Payload</h4>
                                 <pre className="bg-black/20 rounded p-3 text-xs text-gray-300 overflow-auto max-h-40">
                                    {JSON.stringify(log.body, null, 2)}
                                 </pre>
                              </div>
                           )}
                        </CardContent>
                     </Card>
                  ))
               )}
            </div>
         </div>
      </div>
   )
}

export default WebhookLogs
