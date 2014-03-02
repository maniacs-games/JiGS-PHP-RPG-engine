<?php 
defined( '_JEXEC' ) or die( 'Restricted access' );
jimport('joomla.application.component.modellist');
class battleModelMain extends JModellist
{
	var $_data = null;
	public function __constuct($config = array())
	{ 
	/*	if (empty($config['filter_fields'])) {
			$config['filter_fields'] = array(
					'id', 'a.id' ,
					'title', 'a.name',
					'alias', 'a.comment'
					);
		}
		parent::__constuct($config);
	 */
	}
	/**
	 */
	protected function populateState ($ordering = null, $direction = null)
	 {
		// Initiilise variables
		$app			= Jfactory::getApplication ('administrator');
		//load the filter state
		$search			=		$this->getUserStateFromRequest($this->context. '.filter.search','filter_search');
		$this->setstate('filter.search',$search);
		$accessId		=		$this->getUserStateFromRequest ($this->context.'.filter.access', 'filter_access', null, 'int');
		$this->setstate('filter.access' , $accessId);
		$published		=		$this->getUserStateFromRequest ($this->context.'.filter.state', 'filter_published','', 'string');
		$this->setstate('filter.state' , $published);
		$categoryId		=		$this->getUserStateFromRequest ($this->context.'.filter.category_id','filter_category_id','');
		$this->setstate('filter.category_id' , $categoryId);
		//Load the parameters
		$params			=		JComponentHelper::getParams('com_Battle');
		$this->setState('params',$params);
		//List state information
		//	parent::populateState ('a.name','asc');
	}
	function sync_players()
	{	
		$db				= JFactory::getDBO();
		$query			= "SELECT id FROM #__users";
		$db->setQuery($query);
		$userlist		= $db->loadObjectList();
		foreach($userlist as $user)
		{
			$user2		= JFactory::getUser($user->id);
			$query		= "INSERT INTO #__jigs_players (iduser,username) 
							VALUES ('$user->id', '$user2->username')	
							ON DUPLICATE KEY UPDATE iduser = $user->id, username = '$user2->username' ";
			//echo $query;
			$db->setQuery($query);
			$db->query();
			if ($error = $db->getErrorMsg()) 
			{
				echo '<pre>$error====>>>>';print_r($error);echo '</pre>';
			}
		}
		return;
	}
	function sync_players_health()
	{	
		$db				= JFactory::getDBO();
		$query			= "SELECT id FROM #__users";
		$db->setQuery($query);
		$userlist		= $db->loadObjectList();
		foreach($userlist as $user)
		{
			$query		= "UPDATE #__jigs_players SET health = 100 where health < 100";
			//echo $query;
			$db->setQuery($query);
			$db->query();
			if ($error = $db->getErrorMsg()) 
			{
				echo '<pre>$error====>>>>';print_r($error);echo '</pre>';
			}
	}
	return;
	}
	
	
	
	
	function delete_players_orphaned()
	{	
		$db				= JFactory::getDBO();
		$query			= "SELECT iduser FROM #__jigs_players";
		$db->setQuery($query);
		$playerlist		= $db->loadObjectList();
		
		$query			= "SELECT id FROM #__users";
		$db->setQuery($query);
		$users		    = $db->loadResultArray();
		
		
		foreach($playerlist as $player)
		{
			
			if (!in_array($player->iduser,$users))
			{
				$db				= JFactory::getDBO();
		        $query			= "Delete  FROM #__jigs_players WHERE iduser = " . $player->iduser;
		        $db->setQuery($query);
		        
			    echo  $player->iduser . "<br>";
		    }			
        }
	return;
	}
	
	
	
	
	
	
	
	
	
	
	
	
	function sync_players_leases()
	{	
		$db			= JFactory::getDBO();
		$now		= time();
		$query		= "UPDATE #__jigs_flats SET timestamp = $now where resident > 0";
		$db->setQuery($query);
		$db->query();
		if ($error = $db->getErrorMsg()) 
	    {
			echo '<pre>$error====>>>>';print_r($error);echo '</pre>';
	    }
	    return;
	}
	function sync_players_batteries()
	{	
		$db				= JFactory::getDBO();
		$query			= "SELECT id FROM #__users";
		$db->setQuery($query);
		$userlist		= $db->loadObjectList();
		foreach($userlist as $user)
		{
			$query		= "INSERT INTO #__jigs_batteries (iduser) VALUES ('$user->id')";
			//echo $query;
			$db->setQuery($query);
			$db->query();
			if ($error = $db->getErrorMsg()) 
		   	{
				echo '<pre>$error====>>>>';print_r($error);echo '</pre>';
			}
	     }
	return;
	}
	function sync_players_message()
	{	
		$db				= JFactory::getDBO();
		$query			= "SELECT id FROM #__users";
		$db->setQuery($query);
		$userlist		= $db->loadObjectList();
		foreach($userlist as $user)
		{
			$query			= "SELECT message FROM #__jigs_logs WHERE user_id = $user->id limit 1";
			$db->setQuery($query);
			$result			= $db->loadRow();
			if (count($result)<1)
			{	
				$query		= "INSERT INTO #__jigs_logs (message,user_id) VALUES ('Welcome to Pyramid City',$user->id)";
				$db->setQuery($query);
				$db->query();
				if ($error	= $db->getErrorMsg()) 
		   		{
					echo '<pre>$error====>>>>';print_r($error);echo '</pre>';
				}
	     	}
	     }	
	return;
	}
	function sync_players_skills()
	{	
		$db				= JFactory::getDBO();
		$query			= "SELECT id FROM #__users";
		$db->setQuery($query);
		$userlist		= $db->loadObjectList();
		$now = time();
		foreach($userlist as $user)
	     {
	      $query		= "INSERT INTO #__jigs_skills (iduser,timer) 
		VALUES ('$user->id', $now )	ON DUPLICATE KEY UPDATE iduser = $user->id, timer = $now ";
		//echo $query;
		//echo $query;
		$db->setQuery($query);
		$db->query();
		if ($error = $db->getErrorMsg()) 
		    {
			echo '<pre>$error====>>>>';print_r($error);echo '</pre>';
		    }
	     }
	return;
	}	
	function get_params( ){
	    $app		= JFactory::getApplication();
	    //  $componentParams = $app->getParams('com_battle');
	    $params		= JComponentHelper::getParams( 'com_battle' ) ;
	    $param		= $params->get('shoutbox_category', 23); 
	
	return  $param;
	}
	function get_message(){
		$db				= JFactory::getDBO();
		$query			= "SELECT time,text FROM #__shoutbox ORDER BY id DESC LIMIT 20";
		$db->setQuery($query);
		$result			= $db->loadObjectList();
		return $result;
	
	}
	
	
	function factionalise()
	{
			$db				= JFactory::getDBO();
			$query			= "SELECT DISTINCT user_id FROM #__user_usergroup_map";
			$db->setQuery($query);
			$userlist		= $db->loadResultArray();
			foreach ($userlist as $user)
			{
				$query		= "SELECT group_id FROM #__user_usergroup_map WHERE user_id = $user";				
				$db->setQuery($query);
				$groups		= $db->loadResultArray();
				if (count($groups)==1)
				{
					$dice = rand(1,3);
					if ($dice==1)
					{
						$group_id= 35;//cyberian
					}
					elseif($dice==2)
					{
						$group_id= 36;//Gaian
					}
					else
					{
						$group_id= 45;//Fantasia
					}
				$query	= "INSERT INTO  #__user_usergroup_map (user_id,group_id )VALUES ($user,$group_id)";				
				$db->setQuery($query);
				$db->query();	
				}
				if (count($groups)==2)
				{
				//	print_r($groups);
					$f_groups=array();
					if (in_array(35, $groups))// cyberian 
					{
				//	echo "cyberian";
						$f_groups		= $this->select_groups(35);
					
				//	print_r($f_groups);
					
					
					
					}
					elseif (in_array(36, $groups))// Gaia 
					{
					//echo "gaian";
						$f_groups		= $this->select_groups(36);
				//	print_r($f_groups);
					}
					elseif (in_array(42, $groups))// Fanatasia 
					{
				//	echo "fantasian";
						$f_groups		= $this->select_groups(42);
				//	print_r($f_groups);
					}
					else
					{
					//echo "none";
					continue;
					
					}
			
					
					$count = count($f_groups)-1;
					
					
					$index = rand(0,$count);

					
					echo "rand:" . $index;
					
					
					$group_id		= $f_groups[$index];
				
					
									
				
					$query	= "INSERT INTO  #__user_usergroup_map (user_id,group_id )VALUES ($user,$group_id)";				
					
					//echo $query;
					
					
					$db->setQuery($query);
					$db->query();	
				}
				
			}
			return;
	}
	function select_groups($faction_id)
	{
	
		$db				= JFactory::getDBO();
		$query			= "SELECT id FROM #__usergroups WHERE parent_id = $faction_id";	
		$db->setQuery($query);
		$f_g =  $db->loadResultArray();
		
		//print_r($f_g);
		
		return $f_g;
		
	}
}
